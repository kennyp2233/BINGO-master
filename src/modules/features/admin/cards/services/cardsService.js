import { db } from 'config/firebase';
import { collection, query, where, getDocs, updateDoc, orderBy, limit, startAfter, deleteDoc, count, getCountFromServer } from 'firebase/firestore';
import { collCards, collUserCards } from 'store/collections';

// Cache para almacenar el conteo total y evitar consultas repetidas
const eventCardCountCache = new Map();
const paginationCursors = new Map(); // Cache para cursores de paginación

export const returnCard = async (eventId, cardId) => {
  const cardQuery = query(collection(db, collCards), where('event', '==', eventId), where('id', '==', cardId));
  const querySnapshot = await getDocs(cardQuery);

  if (querySnapshot.empty) {
    throw new Error('La cartilla no existe en este evento.');
  }

  const cardDoc = querySnapshot.docs[0];
  const cardData = cardDoc.data();

  if (cardData.state === 2) {
    throw new Error('Esta cartilla ya ha sido devuelta.');
  }

  await updateDoc(cardDoc.ref, { state: 2 });
  clearCardsPaginationCache(eventId);
};

/**
 * Devuelve una cartilla por su número de orden (para casos donde el ID está truncado en PDFs)
 * @param {string} eventId - ID del evento
 * @param {number} cardOrder - Número de la cartilla (order)
 * @returns {Promise<void>}
 */
export const returnCardByOrder = async (eventId, cardOrder) => {
  const cardQuery = query(collection(db, collCards), where('event', '==', eventId), where('order', '==', cardOrder));
  const querySnapshot = await getDocs(cardQuery);

  if (querySnapshot.empty) {
    throw new Error(`La cartilla número ${cardOrder} no existe en este evento.`);
  }

  const cardDoc = querySnapshot.docs[0];
  const cardData = cardDoc.data();

  if (cardData.state === 2) {
    throw new Error(`La cartilla número ${cardOrder} ya ha sido devuelta.`);
  }

  await updateDoc(cardDoc.ref, { state: 2 });
  clearCardsPaginationCache(eventId);
};

/**
 * Devuelve múltiples cartillas por sus números de orden
 * @param {string} eventId - ID del evento
 * @param {number[]} cardOrders - Array de números de cartilla
 * @returns {Promise<{success: number, totalRequested: number}>}
 */
export const returnCardsByOrderBatch = async (eventId, cardOrders) => {
  if (!cardOrders || cardOrders.length === 0) return { success: 0, totalRequested: 0 };

  const uniqueOrders = [...new Set(cardOrders)];
  const chunks = [];
  for (let i = 0; i < uniqueOrders.length; i += 10) {
    chunks.push(uniqueOrders.slice(i, i + 10));
  }

  const { writeBatch } = await import('firebase/firestore');

  let successCount = 0;
  const docsToUpdate = [];

  for (const chunk of chunks) {
    const q = query(
      collection(db, collCards),
      where('event', '==', eventId),
      where('order', 'in', chunk)
    );
    const snapshot = await getDocs(q);

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.state !== 2) {
        docsToUpdate.push(docSnap.ref);
        successCount++;
      }
    });
  }

  const batchChunks = [];
  for (let i = 0; i < docsToUpdate.length; i += 500) {
    batchChunks.push(docsToUpdate.slice(i, i + 500));
  }

  for (const batchChunk of batchChunks) {
    const currentBatch = writeBatch(db);
    batchChunk.forEach(ref => {
      currentBatch.update(ref, { state: 2 });
    });
    await currentBatch.commit();
  }

  clearCardsPaginationCache(eventId);

  return {
    success: successCount,
    totalRequested: uniqueOrders.length
  };
};

/**
 * Obtiene todas las cartillas de un evento
 * @param {string} id - ID del evento
 * @returns {Promise<Array>} Lista de cartillas ordenadas por order
 */
export const getGameCardsByEvent = async (id) => {
  const list = [];
  const q = query(collection(db, collCards), where('event', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
    list.sort((a, b) => a.order - b.order);
  });
  return list;
};

/**
 * Borra todas las cartillas de un evento
 * @param {string} eventId - ID del evento
 */
export const deleteAllCardsByEvent = async (eventId) => {
  const q = query(collection(db, collCards), where('event', '==', eventId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  });
};

/**
 * Obtiene cartillas de un evento con paginación
 * @param {string} eventId - ID del evento
 * @param {number} page - Página a obtener (0-based)
 * @param {number} rowsPerPage - Número de filas por página
 * @param {number|null} stateFilter - Filtro de estado (opcional)
 * @param {number|null} orderFilter - Filtro de orden específico (opcional)
 * @returns {Promise<{cards: Array, totalCount: number}>}
 */
export const getGameCardsByEventPaginated = async (eventId, page = 0, rowsPerPage = 50, stateFilter = null, orderFilter = null) => {
  try {
    // Si hay un filtro de order específico, es una búsqueda directa
    if (orderFilter !== null) {
      const directQuery = query(
        collection(db, collCards),
        where('event', '==', eventId),
        where('order', '==', orderFilter),
        ...(stateFilter !== null ? [where('state', '==', stateFilter)] : [])
      );

      const snapshot = await getDocs(directQuery);
      const cards = snapshot.docs.map((doc) => doc.data());

      return {
        cards,
        totalCount: cards.length
      };
    }

    // Construir la consulta base optimizada
    const baseFilters = [
      where('event', '==', eventId),
      ...(stateFilter !== null ? [where('state', '==', stateFilter)] : []),
      orderBy('order', 'asc')
    ];

    const cacheKey = `${eventId}-${stateFilter}`;
    const cursorKey = `${cacheKey}-cursors`;

    // Para la primera página
    if (page === 0) {
      // Limpiar cursores al empezar desde la primera página
      paginationCursors.delete(cursorKey);

      // Obtener la primera página con un documento extra para verificar si hay más páginas
      const firstPageQuery = query(collection(db, collCards), ...baseFilters, limit(rowsPerPage + 1));

      const snapshot = await getDocs(firstPageQuery);
      const allDocs = snapshot.docs;

      // Separar los documentos de la página actual y verificar si hay más
      const hasMore = allDocs.length > rowsPerPage;
      const pageCards = hasMore ? allDocs.slice(0, rowsPerPage) : allDocs;
      const cards = pageCards.map((doc) => doc.data());

      // Guardar cursor para la siguiente página si hay más datos
      if (hasMore && pageCards.length > 0) {
        const cursors = paginationCursors.get(cursorKey) || [];
        cursors[0] = pageCards[pageCards.length - 1]; // Cursor para página 1
        paginationCursors.set(cursorKey, cursors);
      }

      // Para el conteo total, usar getCountFromServer para eficiencia
      let totalCount;

      if (eventCardCountCache.has(cacheKey)) {
        totalCount = eventCardCountCache.get(cacheKey);
      } else {
        // Usar count() para obtener el conteo exacto sin fetch de documentos
        const countQuery = query(
          collection(db, collCards),
          where('event', '==', eventId),
          ...(stateFilter !== null ? [where('state', '==', stateFilter)] : [])
        );

        const countSnapshot = await getCountFromServer(countQuery);
        totalCount = countSnapshot.data().count;

        // Cachear por 5 minutos
        eventCardCountCache.set(cacheKey, totalCount);
        setTimeout(() => {
          eventCardCountCache.delete(cacheKey);
        }, 5 * 60 * 1000);
      }

      return {
        cards,
        totalCount
      };
    }

    // Para páginas posteriores, usar cursor-based pagination
    const cursors = paginationCursors.get(cursorKey) || [];
    const previousPageCursor = cursors[page - 1];

    let paginatedQuery;

    if (previousPageCursor) {
      // Usar el cursor guardado
      paginatedQuery = query(
        collection(db, collCards),
        ...baseFilters,
        startAfter(previousPageCursor),
        limit(rowsPerPage + 1) // +1 para verificar si hay página siguiente
      );
    } else {
      // Si no tenemos cursor, calculamos desde el inicio (método menos eficiente para saltos de página grandes)
      const skipQuery = query(collection(db, collCards), ...baseFilters, limit(page * rowsPerPage));

      const skipSnapshot = await getDocs(skipQuery);

      if (skipSnapshot.docs.length === 0 || skipSnapshot.docs.length < page * rowsPerPage) {
        return {
          cards: [],
          totalCount: eventCardCountCache.get(cacheKey) || 0
        };
      }

      const lastDoc = skipSnapshot.docs[skipSnapshot.docs.length - 1];
      paginatedQuery = query(collection(db, collCards), ...baseFilters, startAfter(lastDoc), limit(rowsPerPage + 1));
    }

    const snapshot = await getDocs(paginatedQuery);
    const allDocs = snapshot.docs;

    const hasMore = allDocs.length > rowsPerPage;
    const pageCards = hasMore ? allDocs.slice(0, rowsPerPage) : allDocs;
    const cards = pageCards.map((doc) => doc.data());

    // Guardar cursor para la siguiente página si hay más datos
    if (hasMore && pageCards.length > 0) {
      const cursors = paginationCursors.get(cursorKey) || [];
      cursors[page] = pageCards[pageCards.length - 1]; // Cursor para página siguiente
      paginationCursors.set(cursorKey, cursors);
    }

    // Usar el conteo en caché si está disponible
    let totalCount = eventCardCountCache.get(cacheKey);

    if (!totalCount) {
      // Si no está en caché, usar una estimación conservadora
      totalCount = (page + 1) * rowsPerPage + (hasMore ? rowsPerPage : 0);
    }

    return {
      cards,
      totalCount
    };
  } catch (error) {
    console.error('Error getting paginated cards:', error);
    return {
      cards: [],
      totalCount: 0
    };
  }
};

/**
 * Cuenta las cartillas de un evento
 * @param {string} id - ID del evento
 * @returns {Promise<number>} Número de cartillas
 */
export const countCardsByEvent = async (id) => {
  const q = query(collection(db, collCards), where('event', '==', id));
  const querySnapshot = await getDocs(q);
  const count = querySnapshot.size;
  return count;
};

/**
 * Verifica la disponibilidad de una cartilla
 * @param {string} cardId - ID de la cartilla
 * @returns {Promise<{available: boolean, message: string, card?: object, error?: any}>}
 */
export const checkCardAvailability = async (cardId) => {
  try {
    const q = query(collection(db, collCards), where('id', '==', cardId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { available: false, message: 'La cartilla no existe' };
    }

    const cardData = querySnapshot.docs[0].data();

    // Verificar si la cartilla está disponible (state == 1 o state == 2 para devueltas)
    // Estado 0 = No disponible (asignada)
    // Estado 1 = Disponible
    // Estado 2 = Devuelta (tratada como disponible para jugadores)
    if (cardData.state !== 1 && cardData.state !== 2) {
      return {
        available: false,
        message: 'Esta cartilla ya ha sido tomada por otro usuario',
        card: cardData
      };
    }

    return { available: true, card: cardData };
  } catch (error) {
    console.error('Error checking card availability:', error);
    return {
      available: false,
      message: 'Error al verificar disponibilidad de la cartilla',
      error
    };
  }
};

/**
 * Obtiene cartillas de usuario por evento
 * @param {string} id - ID del usuario
 * @param {string} eventId - ID del evento
 * @returns {Promise<Array>} Lista de cartillas ordenadas por order
 */
export const getGameCardsByUserEvent = async (id, eventId) => {
  const list = [];
  const q = query(collection(db, collUserCards), where('userId', '==', id), where('eventId', '==', eventId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
    list.sort((a, b) => a.order - b.order);
  });
  return list;
};

/**
 * Obtiene cartillas por evento y usuario
 * @param {string} event - ID del evento
 * @param {string} user - ID del usuario
 * @returns {Promise<Array>} Lista de cartillas
 */
export const getCardsByEventUsers = async (event, user) => {
  const list = [];
  const q = query(collection(db, collUserCards), where('eventId', '==', event), where('userId', '==', user));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};

/**
 * Función para limpiar caches de paginación de cartillas
 * @param {string|null} eventId - ID del evento (opcional)
 * @param {number|null} stateFilter - Filtro de estado (opcional)
 * */
export const clearCardsPaginationCache = (eventId = null, stateFilter = null) => {
  if (eventId) {
    const cacheKey = `${eventId}-${stateFilter}`;
    const cursorKey = `${cacheKey}-cursors`;

    eventCardCountCache.delete(cacheKey);
    paginationCursors.delete(cursorKey);
  } else {
    // Limpiar todo el cache
    eventCardCountCache.clear();
    paginationCursors.clear();
  }
};

/**
 * Verifica si un evento está agotado (sin cartillas disponibles)
 * @param {string} eventId - ID del evento
 * @returns {Promise<boolean>} True si está agotado
 */
export const checkEventSoldOut = async (eventId) => {
  try {
    // Contar cartillas con estado 1 (disponible) o 2 (devuelta)
    const q = query(
      collection(db, collCards),
      where('event', '==', eventId),
      where('state', 'in', [1, 2])
    );

    // Usar getCountFromServer es mucho más eficiente y barato que getDocs
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;

    return count === 0;
  } catch (error) {
    console.error('Error checking sold out status:', error);
    return false; // Asumir no agotado en caso de error para no bloquear
  }
};