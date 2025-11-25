//Firebase
import { db } from 'config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { collGames } from 'store/collections';
import { genConst } from 'store/constant';

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

// OBTENER EVENTO POR ID
export const getGameById = async (id) => {
  const q = query(collection(db, collGames), where('ide', '==', id));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  return querySnapshot.docs[0].data();
};