//Firebase
import { db, authentication } from 'config/firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import {
  collection,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  addDoc,
  where,
  query,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore';
import {
  collAdminUsers,
  collBoards,
  collCards,
  collGameInscription,
  collGames,
  collGenNoti,
  collIncomes,
  collLog,
  collMail,
  collPayments,
  collSettings,
  collUserCards,
  collUsers,
  collUsrNoti
} from 'store/collections';
import { genConst } from 'store/constant';
import { labels } from 'store/labels';
import { generateId } from 'utils/idGenerator';
import { fullDate, generateDate } from 'utils/validations';
import { checkBingoWin } from 'utils/verifyBingoWinner';

//Encontrar Sesión activa
export function isSessionActive(navigate) {
  onAuthStateChanged(authentication, async (user) => {
    if (user) {
      const q = query(collection(db, collUsers), where('id', '==', user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data().profile == genConst.CONST_PRO_DEF) {
          navigate('/app/dashboard');
        } else {
          navigate('/main/dashboard');
        }
      });
    } else {
      if (window.location.pathname !== '/auth/signin') {
        navigate('/auth/signin');
      }
    }
  });
}
//Update Function Profile
export function updateProfileUser(name, lastName) {
  return updateProfile(authentication.currentUser, { displayName: name + ' ' + lastName });
}

//Encontrar Id de Usuario Sesión
export function getUserId() {
  let userId = null;
  onAuthStateChanged(authentication, (user) => {
    if (user) {
      userId = user.uid;
    }
  });
  return userId;
}

//CRUD FUNCTIONS
export function createDocument(table, idRecord, object) {
  return setDoc(doc(db, table, idRecord), object);
}
export function updateDocument(table, idRecord, object) {
  return updateDoc(doc(db, table, idRecord), object);
}
export function deleteDocument(table, idRecord) {
  return deleteDoc(doc(db, table, idRecord));
}
export function getDocuments(table) {
  return getDocs(collection(db, table));
}
export function createLogRecord(object) {
  return addDoc(collection(db, collLog), object);
}
export function createSystemNotification(object) {
  return addDoc(collection(db, collUsrNoti), object);
}
export function createLogRecordWithId(idRecord, object) {
  return setDoc(doc(db, collLog, idRecord), object);
}
export function createLog(idRecord, object, collection) {
  const objectLog = {
    id: idRecord,
    createAt: fullDate(),
    collection: collection,
    object: object
  };
  return setDoc(doc(db, collLog, idRecord), objectLog);
}
export function createGlobalNotification(message, subject) {
  const object = {
    id: generateId(6),
    from: labels.notiAdmin,
    date: generateDate(),
    message: message,
    subject: subject,
    state: genConst.CONST_NOTIF_NL
  };
  return addDoc(collection(db, collGenNoti), object);
}
//Buscar si existe Usuario
export async function isExistUser(id) {
  let isExist = false;
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    isExist = true;
  } else {
    isExist = false;
  }
  return isExist;
}
//Obtener Datos Perfil de Usuario por ID
export async function getProfileUser(id) {
  let profile = null;
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    profile = doc.data().profile;
  });
  return profile;
}
//Obtener Datos Perfil de Usuario Administrador por ID
export async function getProfileUserAdmin(id) {
  let profile = null;
  const q = query(collection(db, collAdminUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    profile = doc.data().profile;
  });
  return profile;
}
//LISTAS
//Obtenemos la lista de Usuarios
export const getUsersData = async () => {
  const list = [];
  const querySnapshot = await getDocs(collection(db, collUsers));
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
    list.sort((a, b) => a.name.localeCompare(b.name));
  });
  return list;
};
//
export const getGeneralNotifications = async () => {
  const list = [];
  const querySnapshot = await getDocuments(collGenNoti);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
export async function getUserNotifications(id) {
  const list = [];
  const q = query(collection(db, collUsrNoti), where('idUser', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
}
//CARTILLAS
export const getGameCards = async () => {
  const list = [];
  const querySnapshot = await getDocuments(collCards);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
    list.sort((a, b) => a.order - b.order);
  });
  return list;
};
//CARTILLAS POR USUARIO
export const getGameCardsByUser = async (id) => {
  const list = [];
  const q = query(collection(db, collUserCards), where('userId', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
    list.sort((a, b) => a.order - b.order);
  });
  return list;
};
//CARTILLA POR ID
export const getGameCardsById = async (id) => {
  const list = [];
  const q = query(collection(db, collCards), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
//CARTILLAS POR USUARIO Y EVENTO
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
//
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

// OBTENER EVENTO POR ID
export const getGameById = async (id) => {
  const q = query(collection(db, collGames), where('ide', '==', id));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  return querySnapshot.docs[0].data();
};

// BORRAR TODAS LAS CARTILLAS DE UN EVENTO

export const deleteAllCardsByEvent = async (eventId) => {
  const q = query(collection(db, collCards), where('event', '==', eventId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  });
};

// Cache para almacenar el conteo total y evitar consultas repetidas
const eventCardCountCache = new Map();
const paginationCursors = new Map(); // Cache para cursores de paginación

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

      // Para el conteo total, usar una estrategia más eficiente
      let totalCount;

      if (eventCardCountCache.has(cacheKey)) {
        totalCount = eventCardCountCache.get(cacheKey);
      } else if (hasMore) {
        // Solo hacer consulta de conteo si hay más páginas y realmente necesitamos el número exacto
        const countQuery = query(
          collection(db, collCards),
          where('event', '==', eventId),
          ...(stateFilter !== null ? [where('state', '==', stateFilter)] : [])
        );

        const countSnapshot = await getDocs(countQuery);
        totalCount = countSnapshot.size;

        // Cachear por 5 minutos
        eventCardCountCache.set(cacheKey, totalCount);
        setTimeout(() => {
          eventCardCountCache.delete(cacheKey);
        }, 5 * 60 * 1000);
      } else {
        // No hay más páginas, el total es exactamente lo que obtuvimos
        totalCount = cards.length;
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
      // Si no tenemos cursor, calculamos desde el inicio (fallback menos eficiente)
      console.warn(`No cursor available for page ${page}, using less efficient method`);

      // Obtener documentos hasta la página solicitada
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

export async function checkForBingoWinner(eventId, drawnNumbers) {
  // const gameRef = doc(db, 'games', gameId);
  // const userCardsSnap = await getDocs(collection(db, 'games', gameId, 'usercards'));
  if (drawnNumbers.length < 24) return null;
  // console.log({ eventId, drawnNumbers });
  const userCardsQuery = query(collection(db, collUserCards), where('eventId', '==', eventId));

  const userCardsSnap = await getDocs(userCardsQuery);

  for (const doc of userCardsSnap.docs) {
    const cardData = doc.data();
    // console.log({ cardData });
    // Si esta cartilla tiene todos los números marcados, es ganadora
    if (checkBingoWin({ cardNumbers: cardData.bingoNumbers, drawnNumbers })) {
      // await updateDoc(gameRef, {
      //   winner: { userId: cardData.userId, cardId: doc.id }
      // });
      console.log(`🎉 Ganador encontrado: ${cardData.userId}`);
      return cardData;
    }
  }

  return null;
}

export async function getMail() {
  const list = [];
  const querySnapshot = await getDocuments(collMail);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
}
//Obtenemos la lista de Usuarios Administradores
export const getAdminUsersData = async () => {
  const list = [];
  const q = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_ADM));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
//Obtenemos la lista de Usuarios Administradores
export const getUsersList = async () => {
  const list = [];
  const q = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_DEF));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
//Obtenemos la lista de Partidas
export const getGamesList = async () => {
  const list = [];
  const q = query(collection(db, collGames), where('state', '!=', genConst.CONST_STA_OFF));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};

export const getAllGamesList = async () => {
  const list = [];
  const q = query(collection(db, collGames));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};

//Obtenemos la lista de Pagos
export const getPaymentsList = async () => {
  const list = [];
  const querySnapshot = await getDocuments(collPayments);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};

export const getPaymentByTransaction = async (transactionId, clientTransactionId) => {
  const q = query(
    collection(db, collPayments),
    where('transactionId', '==', transactionId),
    where('clientTransactionId', '==', clientTransactionId)
  );

  const querySnapshot = await getDocs(q);
  const firstDoc = querySnapshot.docs[0];

  return firstDoc ? firstDoc.data() : null;
};

//Obtenemos la lista de Usuarios por Partida
export const getGameUsers = async (id) => {
  const list = [];
  const q = query(collection(db, collGameInscription), where('idGame', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
//Obtenemos la lista de Cartillas por Evento y Usuario
export const getCardsByEventUsers = async (event, user) => {
  const list = [];
  const q = query(collection(db, collUserCards), where('eventId', '==', event), where('userId', '==', user));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
//Obtenemos la lista de Eventos por Id
export const getGameNameById = async (id) => {
  let list = [];
  const q = query(collection(db, collGames), where('ide', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
//Obtenemos datos de Usuario por codigo
export const getUsersDataByCode = async (code) => {
  const list = [];
  const q = query(collection(db, collUsers), where('ownReferal', '==', code));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
//Obtenemos lista de Parámetros
export async function getParamsData() {
  const list = [];
  const querySnapshot = await getDocuments(collSettings);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
    list.sort((a, b) => a.type.localeCompare(b.type));
  });
  return list;
}
//Obtenemos lista de Logs
export async function getLogsData() {
  const list = [];
  const querySnapshot = await getDocuments(collLog);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
}
//Obtenemos el nombre y apellido de Usuario por ID
export async function getUserName(id) {
  let name = null;
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    name = doc.data().name + ' ' + doc.data().lastName;
  });
  return name;
}
//Obtenemos el nombre y apellido de Usuario por ID
export async function getUserNameByCode(code) {
  let name = null;
  const q = query(collection(db, collUsers), where('ownReferal', '==', code));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    name = doc.data().name + ' ' + doc.data().lastName;
  });
  return name;
}
//STADISTICS COUNT ITEMS
//Obtenemos cantidad de Usuarios Registrados
export const countUser = async () => {
  const q = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_DEF));
  const querySnapshot = await getDocs(q);
  const count = querySnapshot.size;
  return count;
};
//
export const countCardsByEvent = async (id) => {
  const q = query(collection(db, collCards), where('event', '==', id));
  const querySnapshot = await getDocs(q);
  const count = querySnapshot.size;
  return count;
};
//Obtenemos cantidad de Cartillas
export const countCards = async () => {
  const data = collection(db, collCards);
  const querySnapshot = await getDocs(data);
  const count = querySnapshot.size;
  return count;
};
//Obtenemos cantidad de Cartillas
export const countGames = async () => {
  const data = collection(db, collGames);
  const querySnapshot = await getDocs(data);
  const count = querySnapshot.size;
  return count;
};
//Total beneficio
export async function getTotalPaidBenefit(filter = {}) {
  let total = 0;

  let q = collection(db, collPayments);

  if (filter.statusCode) {
    q = query(q, where('statusCode', '==', filter.statusCode));
  }

  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    querySnapshot.forEach((doc) => {
      total = Number.parseFloat(total) + Number.parseFloat(doc.data().total);
    });
  }

  return total;
}
//Obtenemos cantidad de Usuarios Administradores Registrados
export const countAdminUser = async () => {
  const q = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_ADM));
  const querySnapshot = await getDocs(q);
  const count = querySnapshot.size;
  return count;
};
export const countTotalIncomes = async () => {
  const totalCollection = collection(db, collIncomes);
  const querySnapshot = await getDocs(totalCollection);
  const incomesCount = querySnapshot.size;
  return incomesCount;
};

export async function getUserState(id) {
  let state = null;
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    state = doc.data().state;
  });
  return state;
}

export async function getUserData(id) {
  let data = [];
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
}

export const getUserDataObject = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(
      authentication,
      (user) => {
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      },
      reject
    );
  });
};

export const getUsersListPaginated = async (page = 0, rowsPerPage = 10, searchTerm = '') => {
  try {
    // Si hay un término de búsqueda, usamos búsqueda en cliente
    if (searchTerm && searchTerm.trim() !== '') {
      // Obtener todos los usuarios con perfil normal
      const allUsersQuery = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_DEF));
      const allUsersSnapshot = await getDocs(allUsersQuery);

      // Filtrar en el cliente para búsqueda más flexible
      const searchLowerCase = searchTerm.toLowerCase().trim();
      const filteredUsers = [];

      allUsersSnapshot.forEach((doc) => {
        const userData = doc.data();

        // Crear el fullName si no existe, usando name y lastName
        const fullName =
          userData.fullName || (userData.name && userData.lastName ? `${userData.name} ${userData.lastName}` : '') || userData.name || '';

        const email = userData.email || '';
        const name = userData.name || '';
        const lastName = userData.lastName || '';

        // Búsqueda flexible: buscar en fullName, name, lastName y email
        const searchIn = [
          fullName.toLowerCase(),
          email.toLowerCase(),
          name.toLowerCase(),
          lastName.toLowerCase(),
          `${name} ${lastName}`.toLowerCase() // combinación name + lastName
        ];

        // Verificar si alguno de los campos contiene el término de búsqueda
        const matches = searchIn.some(
          (field) => field.includes(searchLowerCase) || searchLowerCase.split(' ').every((term) => field.includes(term))
        );

        if (matches) {
          // Asegurar que el objeto tenga fullName para el componente
          filteredUsers.push({
            ...userData,
            fullName: fullName || `${name} ${lastName}`.trim()
          });
        }
      });

      // Ordenar por fullName
      filteredUsers.sort((a, b) => {
        const nameA = a.fullName || `${a.name || ''} ${a.lastName || ''}`.trim();
        const nameB = b.fullName || `${b.name || ''} ${b.lastName || ''}`.trim();
        return nameA.localeCompare(nameB);
      });

      // Aplicar paginación manualmente
      const totalCount = filteredUsers.length;
      const startIndex = page * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      return {
        users: paginatedUsers,
        totalCount
      };
    }

    // Sin búsqueda: usar paginación de servidor normal
    const baseQuery = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_DEF));

    // Contar total de usuarios para paginación
    const countSnapshot = await getDocs(baseQuery);
    const totalCount = countSnapshot.size;

    // Query para la página actual
    let paginatedQuery;

    if (page === 0) {
      // Primera página
      paginatedQuery = query(baseQuery, limit(rowsPerPage));
    } else {
      // Páginas siguientes: obtener todos hasta la página actual y tomar los últimos
      const skipCount = page * rowsPerPage;
      const allDocsQuery = query(baseQuery, limit(skipCount + rowsPerPage));
      const allDocsSnapshot = await getDocs(allDocsQuery);

      const allDocs = allDocsSnapshot.docs;
      const pageUsers = allDocs.slice(skipCount).map((doc) => {
        const userData = doc.data();
        // Asegurar que cada usuario tenga fullName
        return {
          ...userData,
          fullName:
            userData.fullName || (userData.name && userData.lastName ? `${userData.name} ${userData.lastName}` : '') || userData.name || ''
        };
      });

      return {
        users: pageUsers,
        totalCount
      };
    }

    const snapshot = await getDocs(paginatedQuery);
    const users = snapshot.docs.map((doc) => {
      const userData = doc.data();
      // Asegurar que cada usuario tenga fullName
      return {
        ...userData,
        fullName:
          userData.fullName || (userData.name && userData.lastName ? `${userData.name} ${userData.lastName}` : '') || userData.name || ''
      };
    });

    return {
      users,
      totalCount
    };
  } catch (error) {
    console.error('Error getting paginated users:', error);

    // Fallback: obtener usuarios de forma simple
    try {
      const fallbackQuery = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_DEF), limit(rowsPerPage));

      const fallbackSnapshot = await getDocs(fallbackQuery);
      const fallbackUsers = fallbackSnapshot.docs.map((doc) => {
        const userData = doc.data();
        return {
          ...userData,
          fullName:
            userData.fullName || (userData.name && userData.lastName ? `${userData.name} ${userData.lastName}` : '') || userData.name || ''
        };
      });

      return {
        users: fallbackUsers,
        totalCount: fallbackUsers.length
      };
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      return {
        users: [],
        totalCount: 0
      };
    }
  }
};

export const getPaymentsListPaginated = async (page = 0, rowsPerPage = 10, searchTerm = '') => {
  try {
    // Query base para pagos
    let paymentsQuery;

    // Si hay un término de búsqueda, filtramos por details
    if (searchTerm && searchTerm.trim() !== '') {
      const searchLowerCase = searchTerm.toLowerCase();
      const end = searchLowerCase + '\uf8ff';

      // Búsqueda por details (requiere índice compuesto)
      paymentsQuery = query(
        collection(db, collPayments),
        where('details', '>=', searchLowerCase),
        where('details', '<=', end),
        orderBy('details')
      );
    } else {
      // Sin búsqueda, ordenamos por fecha de creación (más recientes primero)
      paymentsQuery = query(collection(db, collPayments), orderBy('createAt', 'desc'));
    }

    // Obtenemos el total para la paginación
    const countSnapshot = await getDocs(paymentsQuery);
    const totalCount = countSnapshot.size;

    // Aplicamos paginación
    let paginatedQuery;

    if (page > 0) {
      // Si no es la primera página, necesitamos el último documento de la página anterior
      const lastVisibleDoc = await getDocs(query(paymentsQuery, limit(page * rowsPerPage)));

      if (lastVisibleDoc.docs.length > 0) {
        const lastDoc = lastVisibleDoc.docs[lastVisibleDoc.docs.length - 1];
        paginatedQuery = query(paymentsQuery, startAfter(lastDoc), limit(rowsPerPage));
      } else {
        return {
          payments: [],
          totalCount
        };
      }
    } else {
      // Primera página
      paginatedQuery = query(paymentsQuery, limit(rowsPerPage));
    }

    const snapshot = await getDocs(paginatedQuery);
    const payments = snapshot.docs.map((doc) => doc.data());

    return {
      payments,
      totalCount
    };
  } catch (error) {
    console.error('Error getting paginated payments:', error);
    // Enfoque alternativo en caso de error
    try {
      const simpleQuery = query(collection(db, collPayments), orderBy('createAt', 'desc'), limit(rowsPerPage));

      const snapshot = await getDocs(simpleQuery);
      return {
        payments: snapshot.docs.map((doc) => doc.data()),
        totalCount: snapshot.size
      };
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      return {
        payments: [],
        totalCount: 0
      };
    }
  }
};

// Verificar disponibilidad de una cartilla
export const checkCardAvailability = async (cardId) => {
  try {
    const q = query(collection(db, collCards), where('id', '==', cardId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { available: false, message: 'La cartilla no existe' };
    }

    const cardData = querySnapshot.docs[0].data();

    // Verificar si la cartilla está disponible (state == 1)
    if (cardData.state !== 1) {
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

// Obtener cartillas de usuario paginadas
export const getUserCardsPaginated = async (userId, page = 0, rowsPerPage = 300) => {
  try {
    // Query base para cartillas de usuario
    let cardsQuery = query(collection(db, collUserCards), where('userId', '==', userId), orderBy('order', 'asc'));

    // Obtenemos el total para la paginación
    const countSnapshot = await getDocs(cardsQuery);
    const totalCount = countSnapshot.size;

    // Aplicamos paginación
    let paginatedQuery;

    if (page > 0) {
      // Si no es la primera página, necesitamos el último documento de la página anterior
      const lastVisibleDoc = await getDocs(query(cardsQuery, limit(page * rowsPerPage)));

      if (lastVisibleDoc.docs.length > 0) {
        const lastDoc = lastVisibleDoc.docs[lastVisibleDoc.docs.length - 1];
        paginatedQuery = query(cardsQuery, startAfter(lastDoc), limit(rowsPerPage));
      } else {
        return {
          cards: [],
          totalCount
        };
      }
    } else {
      // Primera página
      paginatedQuery = query(cardsQuery, limit(rowsPerPage));
    }

    const snapshot = await getDocs(paginatedQuery);
    const cards = snapshot.docs.map((doc) => doc.data());

    return {
      cards,
      totalCount
    };
  } catch (error) {
    console.error('Error getting paginated user cards:', error);
    return {
      cards: [],
      totalCount: 0
    };
  }
};

// Función para limpiar caches (útil cuando se agregan/eliminan cartillas)
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
