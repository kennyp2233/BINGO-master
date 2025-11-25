import { db } from 'config/firebase';
import { collection, query, where, getDocs, updateDoc, writeBatch, doc } from 'firebase/firestore';
import { createDocument } from 'modules/shared/services/firebaseCommon';
import { collCards, collUserCards, collPayments } from 'store/collections';
import { generateId } from 'utils/idGenerator';
import { fullDate } from 'utils/validations';

/**
 * Verifica la disponibilidad de una cartilla específica
 * @param {string} cardId - ID de la cartilla a verificar
 * @returns {Promise<{available: boolean, message?: string}>}
 */
export const verifyCardAvailability = async (cardId) => {
  try {
    const cardQuery = query(collection(db, collCards), where('id', '==', cardId));
    const querySnapshot = await getDocs(cardQuery);

    if (querySnapshot.empty) {
      return { available: false, message: 'La cartilla no existe' };
    }

    const cardData = querySnapshot.docs[0].data();

    if (cardData.state === 0) {
      return { available: false, message: 'Esta cartilla ya está asignada' };
    }

    // Cartillas devueltas (estado 2) ahora son reasignables con advertencia
    if (cardData.state === 2) {
      return {
        available: true,
        returned: true,
        message: 'Esta cartilla fue devuelta anteriormente. ¿Desea reasignarla?'
      };
    }

    return { available: true };
  } catch (error) {
    console.error('Error al verificar disponibilidad de cartilla:', error);
    throw new Error('Error al verificar disponibilidad de la cartilla');
  }
};

/**
 * Asigna múltiples cartillas a un usuario
 * @param {Array} selectedCards - Array de cartillas seleccionadas
 * @param {Object} event - Información del evento
 * @param {Object} user - Información del usuario
 * @returns {Promise<Array<string>>} - Array de IDs de las cartillas asignadas
 */
export const assignCardsToUser = async (selectedCards, event, user) => {
  const batch = writeBatch(db);
  const assignedCardIds = [];

  try {
    // Verificar disponibilidad de todas las cartillas primero
    for (const card of selectedCards) {
      const availability = await verifyCardAvailability(card.id);
      if (!availability.available) {
        throw new Error(`La cartilla ${card.order} no está disponible: ${availability.message}`);
      }
    }

    // Crear asignaciones y actualizar estados
    for (const card of selectedCards) {
      const userCardId = generateId(10);

      // Datos para la cartilla del usuario
      const userCardData = {
        id: userCardId,
        idCard: card.id,
        num: card.num,
        eventId: event.ide,
        eventName: event.name,
        eventDate: event.startDate,
        order: card.order,
        b: card.b,
        i: card.i,
        n: card.n,
        g: card.g,
        o: card.o,
        bingoNumbers: card.bingoNumbers,
        state: 0, // Asignada
        createAt: fullDate(),
        userId: user.id,
        userName: user.fullName
      };

      // Datos para actualizar la cartilla original
      const updateData = {
        state: 0, // Asignada
        updateAt: fullDate()
      };

      // Agregar operaciones al batch
      const userCardRef = doc(db, collUserCards, userCardId);
      batch.set(userCardRef, userCardData);

      // Buscar y actualizar la cartilla original
      const cardQuery = query(collection(db, collCards), where('id', '==', card.id));
      const cardSnapshot = await getDocs(cardQuery);
      if (!cardSnapshot.empty) {
        const cardRef = cardSnapshot.docs[0].ref;
        batch.update(cardRef, updateData);
      }

      assignedCardIds.push(userCardId);
    }

    // Ejecutar todas las operaciones en batch
    await batch.commit();

    return assignedCardIds;
  } catch (error) {
    console.error('Error al asignar cartillas:', error);
    throw error;
  }
};

/**
 * Crea un registro de pago para la asignación de cartillas
 * @param {Array} selectedCards - Cartillas asignadas
 * @param {Object} event - Información del evento
 * @param {Object} user - Información del usuario
 * @param {number} totalAmount - Monto total del pago
 * @returns {Promise<string>} - ID del pago creado
 */
export const createAssignmentPayment = async (selectedCards, event, user, totalAmount) => {
  try {
    const paymentId = generateId(10);
    const cardsNumbers = selectedCards.map((card) => card.num).join(', ');

    const paymentData = {
      id: paymentId,
      createAt: fullDate(),
      userId: user.id,
      userName: user.fullName,
      details: `Cartillas evento: ${event.name}`,
      card: cardsNumbers,
      total: totalAmount,
      transactionId: paymentId,
      clientTransactionId: generateId(8),
      eventId: event.ide,
      statusCode: 3, // Aprobado
      status: 'Aprobado',
      provider: 'Manual'
    };

    await createDocument(collPayments, paymentId, paymentData);

    return paymentId;
  } catch (error) {
    console.error('Error al crear registro de pago:', error);
    throw new Error('Error al procesar el pago de la asignación');
  }
};

/**
 * Procesa la asignación completa de cartillas (asignación + pago)
 * @param {Array} selectedCards - Cartillas a asignar
 * @param {Object} event - Información del evento
 * @param {Object} user - Información del usuario
 * @returns {Promise<{assignedCardIds: Array<string>, paymentId: string}>}
 */
export const processCardAssignment = async (selectedCards, event, user) => {
  try {
    // Calcular el total
    const totalAmount = selectedCards.length * event.price;

    // Asignar cartillas
    const assignedCardIds = await assignCardsToUser(selectedCards, event, user);

    // Crear registro de pago
    const paymentId = await createAssignmentPayment(selectedCards, event, user, totalAmount);

    return {
      assignedCardIds,
      paymentId,
      totalAmount
    };
  } catch (error) {
    console.error('Error al procesar asignación completa:', error);
    throw error;
  }
};

/**
 * Obtiene cartillas disponibles para un evento con filtros
 * @param {string} eventId - ID del evento
 * @param {number} page - Página actual
 * @param {number} rowsPerPage - Registros por página
 * @param {number|null} stateFilter - Filtro de estado (null = todos, 0 = asignada, 1 = disponible, 2 = devuelta)
 * @param {number|null} orderFilter - Filtro de número de cartilla
 * @returns {Promise<{cards: Array, totalCount: number}>}
 */
export const getAvailableCardsForEvent = async (eventId, page = 0, rowsPerPage = 48, stateFilter = null, orderFilter = null) => {
  try {
    let q = query(collection(db, collCards), where('event', '==', eventId));

    // Aplicar filtros si existen
    if (stateFilter !== null) {
      q = query(q, where('state', '==', stateFilter));
    }

    if (orderFilter !== null) {
      q = query(q, where('order', '==', orderFilter));
    }

    const querySnapshot = await getDocs(q);
    const allCards = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Paginación manual
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedCards = allCards.slice(startIndex, endIndex);

    return {
      cards: paginatedCards,
      totalCount: allCards.length
    };
  } catch (error) {
    console.error('Error al obtener cartillas disponibles:', error);
    throw new Error('Error al cargar las cartillas disponibles');
  }
};