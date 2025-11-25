//Firebase
import { db } from 'config/firebase';
import { setDoc, updateDoc, deleteDoc, doc, collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { collUsers, collLog } from 'store/collections';
import { fullDate } from 'utils/validations';

/**
 * Crea un documento en una colección específica
 * @param {string} collectionName - Nombre de la colección
 * @param {string} docId - ID del documento
 * @param {object} data - Datos del documento
 */
export const createDocument = async (collectionName, docId, data) => {
  try {
    await setDoc(doc(db, collectionName, docId), data);
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

/**
 * Actualiza un documento en una colección específica
 * @param {string} collectionName - Nombre de la colección
 * @param {string} docId - ID del documento
 * @param {object} data - Datos a actualizar
 */
export const updateDocument = async (collectionName, docId, data) => {
  try {
    await updateDoc(doc(db, collectionName, docId), data);
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

/**
 * Elimina un documento de una colección específica
 * @param {string} collectionName - Nombre de la colección
 * @param {string} docId - ID del documento
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

/**
 * Verifica si existe un usuario
 * @param {string} id - ID del usuario
 * @returns {Promise<boolean>} True si existe, false si no
 */
export const isExistUser = async (id) => {
  let isExist = false;
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    isExist = true;
  } else {
    isExist = false;
  }
  return isExist;
};

/**
 * Obtiene el perfil de un usuario por ID
 * @param {string} id - ID del usuario
 * @returns {Promise<string|null>} Perfil del usuario o null
 */
export const getProfileUser = async (id) => {
  let profile = null;
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    profile = doc.data().profile;
  });
  return profile;
};

/**
 * Obtiene los datos de un usuario por ID
 * @param {string} id - ID del usuario
 * @returns {Promise<Array>} Array con los datos del usuario
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
 * Crea un registro de log
 * @param {string} idRecord - ID del registro
 * @param {object} object - Objeto del log
 * @param {string} collectionName - Nombre de la colección
 */
export const createLog = async (idRecord, object, collectionName) => {
  const objectLog = {
    id: idRecord,
    createAt: fullDate(),
    collection: collectionName,
    object: object
  };
  return setDoc(doc(db, collLog, idRecord), objectLog);
};