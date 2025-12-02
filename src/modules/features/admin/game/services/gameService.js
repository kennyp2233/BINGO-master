import { db } from 'config/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { collUserCards, collGames } from 'store/collections';
import { checkBingoWin, checkQuinaWin } from 'modules/shared/utils/verifyBingoWinner';

/**
 * Verifica si hay un ganador en el evento actual
 * @param {string} eventId - ID del evento/juego
 * @param {Array<number>} drawnNumbers - Array de números sorteados
 * @param {Object} quinaRules - Reglas para la Quina
 * @returns {Promise<Object>} Objeto con ganadores de Bingo y Quina
 */
export const checkForBingoWinner = async (eventId, drawnNumbers, quinaRules = {}) => {
  // Se requieren al menos 4 números para Quina (con FREE) y 24 para Bingo
  if (drawnNumbers.length < 4) return { bingoWinners: [], quinaWinners: [] };

  try {
    // Obtener todas las cartillas de usuarios para este evento
    const userCardsQuery = query(collection(db, collUserCards), where('eventId', '==', eventId));

    const userCardsSnap = await getDocs(userCardsQuery);
    const bingoWinners = [];
    const quinaWinners = [];

    // Iterar sobre cada cartilla para verificar si es ganadora
    for (const doc of userCardsSnap.docs) {
      const cardData = doc.data();
      let isBingo = false;

      // Verificar Bingo (Apagón) - Solo si hay suficientes números
      if (drawnNumbers.length >= 24) {
        if (checkBingoWin({ cardNumbers: cardData.bingoNumbers, drawnNumbers })) {
          console.log(`🎉 Ganador BINGO encontrado: ${cardData.userId}`);
          bingoWinners.push(cardData);
          isBingo = true;
        }
      }

      // Verificar Quina (Solo si NO es Bingo)
      if (!isBingo && checkQuinaWin({ cardNumbers: cardData.bingoNumbers, drawnNumbers, rules: quinaRules })) {
        console.log(`🎉 Ganador QUINA encontrado: ${cardData.userId}`);
        quinaWinners.push(cardData);
      }
    }

    return { bingoWinners, quinaWinners };
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
/**
 * Actualiza los datos de un juego/evento
 * @param {string} id - ID del documento del juego
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<void>}
 */
export const updateGame = (id, data) => updateDoc(doc(db, collGames, id), data);
