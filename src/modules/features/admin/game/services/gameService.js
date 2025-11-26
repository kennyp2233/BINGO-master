import { db } from 'config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { collUserCards } from 'store/collections';
import { checkBingoWin } from 'utils/verifyBingoWinner';

/**
 * Verifica si hay un ganador en el evento actual
 * @param {string} eventId - ID del evento/juego
 * @param {Array<number>} drawnNumbers - Array de números sorteados
 * @returns {Promise<Object|null>} Datos de la cartilla ganadora o null
 */
export const checkForBingoWinner = async (eventId, drawnNumbers) => {
  // Se requieren al menos 24 números para tener un ganador
  if (drawnNumbers.length < 24) return null;

  try {
    // Obtener todas las cartillas de usuarios para este evento
    const userCardsQuery = query(collection(db, collUserCards), where('eventId', '==', eventId));

    const userCardsSnap = await getDocs(userCardsQuery);

    // Iterar sobre cada cartilla para verificar si es ganadora
    for (const doc of userCardsSnap.docs) {
      const cardData = doc.data();

      // Verificar si esta cartilla tiene todos los números marcados
      if (checkBingoWin({ cardNumbers: cardData.bingoNumbers, drawnNumbers })) {
        console.log(`🎉 Ganador encontrado: ${cardData.userId}`);
        return cardData;
      }
    }

    return null;
  } catch (error) {
    console.error('Error al verificar ganador:', error);
    throw error;
  }
};

/**
 * Obtiene todas las cartillas de un evento específico
 * @param {string} eventId - ID del evento
 * @returns {Promise<Array>} Lista de cartillas del evento
 */
export const getEventCards = async (eventId) => {
  const list = [];
  const q = query(collection(db, collUserCards), where('eventId', '==', eventId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};

/**
 * Obtiene las cartillas de un usuario en un evento específico
 * @param {string} userId - ID del usuario
 * @param {string} eventId - ID del evento
 * @returns {Promise<Array>} Lista de cartillas del usuario en el evento
 */
export const getUserEventCards = async (userId, eventId) => {
  const list = [];
  const q = query(collection(db, collUserCards), where('userId', '==', userId), where('eventId', '==', eventId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};
