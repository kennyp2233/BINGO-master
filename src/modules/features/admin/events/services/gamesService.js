import { db } from 'config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { collGames, collGameInscription } from 'store/collections';
import { genConst } from 'store/constant';

/**
 * Obtiene la lista de juegos/partidas activos
 * @returns {Promise<Array>} Lista de juegos
 */
export const getGamesList = async () => {
  const list = [];
  const q = query(collection(db, collGames), where('state', '!=', genConst.CONST_STA_OFF));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};

/**
 * Obtiene la lista completa de juegos/partidas (incluyendo inactivos)
 * @returns {Promise<Array>} Lista completa de juegos
 */
export const getAllGamesList = async () => {
  const list = [];
  const q = query(collection(db, collGames));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};

/**
 * Obtiene un juego por su ID
 * @param {string} id - ID del juego
 * @returns {Promise<Object|null>} Datos del juego o null
 */
export const getGameById = async (id) => {
  const q = query(collection(db, collGames), where('ide', '==', id));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  return querySnapshot.docs[0].data();
};

/**
 * Obtiene el nombre de un juego por su ID
 * @param {string} id - ID del juego
 * @returns {Promise<Array>} Lista con datos del juego
 */
export const getGameNameById = async (id) => {
  let list = [];
  const q = query(collection(db, collGames), where('ide', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};

/**
 * Obtiene la lista de usuarios inscritos en un juego
 * @param {string} id - ID del juego
 * @returns {Promise<Array>} Lista de usuarios inscritos
 */
export const getGameUsers = async (id) => {
  const list = [];
  const q = query(collection(db, collGameInscription), where('idGame', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};

/**
 * Cuenta la cantidad total de juegos
 * @returns {Promise<number>} Cantidad de juegos
 */
export const countGames = async () => {
  const data = collection(db, collGames);
  const querySnapshot = await getDocs(data);
  const count = querySnapshot.size;
  return count;
};