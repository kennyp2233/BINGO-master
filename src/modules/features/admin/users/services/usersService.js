import { db } from 'config/firebase';
import { collection, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
import { collUsers } from 'store/collections';
import { genConst } from 'store/constant';

/**
 * Obtiene la lista de usuarios con paginación y búsqueda
 * @param {number} page - Página actual (0-based)
 * @param {number} rowsPerPage - Registros por página
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Promise<{users: Array, totalCount: number}>}
 */
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

/**
 * Obtiene la lista de usuarios normales (no administradores)
 * @returns {Promise<Array>} Lista de usuarios
 */
export const getUsersList = async () => {
  const list = [];
  const q = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_DEF));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};

/**
 * Obtiene la lista de usuarios administradores
 * @returns {Promise<Array>} Lista de administradores
 */
export const getAdminUsersData = async () => {
  const list = [];
  const q = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_ADM));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};

/**
 * Obtiene datos de usuario por código de referido
 * @param {string} code - Código de referido
 * @returns {Promise<Array>} Lista de usuarios
 */
export const getUsersDataByCode = async (code) => {
  const list = [];
  const q = query(collection(db, collUsers), where('ownReferal', '==', code));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};

/**
 * Obtiene el nombre completo de un usuario por ID
 * @param {string} id - ID del usuario
 * @returns {Promise<string|null>} Nombre completo o null
 */
export const getUserName = async (id) => {
  let name = null;
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    name = doc.data().name + ' ' + doc.data().lastName;
  });
  return name;
};

/**
 * Obtiene el nombre completo de un usuario por código de referido
 * @param {string} code - Código de referido
 * @returns {Promise<string|null>} Nombre completo o null
 */
export const getUserNameByCode = async (code) => {
  let name = null;
  const q = query(collection(db, collUsers), where('ownReferal', '==', code));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    name = doc.data().name + ' ' + doc.data().lastName;
  });
  return name;
};

/**
 * Obtiene datos de usuario por ID
 * @param {string} id - ID del usuario
 * @returns {Promise<Array>} Lista de datos de usuario
 */
export const getUserData = async (id) => {
  let data = [];
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
};

/**
 * Obtiene el estado de un usuario por ID
 * @param {string} id - ID del usuario
 * @returns {Promise<any>} Estado del usuario
 */
export const getUserState = async (id) => {
  let state = null;
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    state = doc.data().state;
  });
  return state;
};

/**
 * Cuenta la cantidad de usuarios registrados (no administradores)
 * @returns {Promise<number>} Cantidad de usuarios
 */
export const countUser = async () => {
  const q = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_DEF));
  const querySnapshot = await getDocs(q);
  const count = querySnapshot.size;
  return count;
};

/**
 * Cuenta la cantidad de usuarios administradores registrados
 * @returns {Promise<number>} Cantidad de administradores
 */
export const countAdminUser = async () => {
  const q = query(collection(db, collUsers), where('profile', '==', genConst.CONST_PRO_ADM));
  const querySnapshot = await getDocs(q);
  const count = querySnapshot.size;
  return count;
};