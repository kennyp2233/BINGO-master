/**
 * Servicio unificado para operaciones de juegos/bingo
 */

import { db } from 'config/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { collGames } from 'store/collections';
import { genConst } from 'store/constant';

/**
 * Obtiene la lista de juegos activos (excluyendo los desactivados)
 * @returns {Promise<Array>} Lista de juegos activos
 */
export const getActiveGamesList = async () => {
  try {
    const q = query(collection(db, collGames), where('state', '!=', genConst.CONST_STA_OFF));
    const querySnapshot = await getDocs(q);

    const games = [];
    querySnapshot.forEach((doc) => {
      games.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return games;
  } catch (error) {
    console.error('Error obteniendo lista de juegos activos:', error);
    throw error;
  }
};

/**
 * Obtiene todos los juegos sin filtros
 * @returns {Promise<Array>} Lista completa de juegos
 */
export const getAllGamesList = async () => {
  try {
    const q = query(collection(db, collGames));
    const querySnapshot = await getDocs(q);

    const games = [];
    querySnapshot.forEach((doc) => {
      games.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return games;
  } catch (error) {
    console.error('Error obteniendo lista completa de juegos:', error);
    throw error;
  }
};

/**
 * Obtiene la lista de juegos recientes (últimos 50, ordenados por fecha)
 * @returns {Promise<Array>} Lista de juegos recientes
 */
export const getRecentGamesList = async () => {
  try {
    const gamesRef = collection(db, 'games');
    const q = query(gamesRef, orderBy('createdAt', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);

    const games = [];
    querySnapshot.forEach((doc) => {
      games.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return games;
  } catch (error) {
    console.error('Error obteniendo lista de juegos recientes:', error);
    throw error;
  }
};

/**
 * Obtiene un juego específico por ID
 * @param {string} gameId - ID del juego
 * @returns {Promise<Object|null>} Datos del juego
 */
export const getGameById = async (gameId) => {
  try {
    // Primero intentar con la colección usando constantes
    const q1 = query(collection(db, collGames), where('ide', '==', gameId));
    const snapshot1 = await getDocs(q1);

    if (!snapshot1.empty) {
      return {
        id: snapshot1.docs[0].id,
        ...snapshot1.docs[0].data()
      };
    }

    // Si no encuentra, intentar con la colección directa 'games'
    const gamesRef = collection(db, 'games');
    const q2 = query(gamesRef, where('__name__', '==', gameId));
    const snapshot2 = await getDocs(q2);

    if (!snapshot2.empty) {
      return {
        id: snapshot2.docs[0].id,
        ...snapshot2.docs[0].data()
      };
    }

    return null;
  } catch (error) {
    console.error('Error obteniendo juego por ID:', error);
    throw error;
  }
};

/**
 * Verifica si un usuario puede jugar un juego específico
 * @param {string} userId - ID del usuario
 * @param {string} gameId - ID del juego
 * @returns {Promise<boolean>} True si puede jugar
 */
export const canUserPlayGame = async (userId, gameId) => {
  try {
    // Verificar si el usuario tiene cartillas para este juego
    const userCardsRef = collection(db, 'userCards');
    const q = query(
      userCardsRef,
      where('userId', '==', userId),
      where('gameId', '==', gameId),
      where('status', '==', 'active')
    );
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error verificando si usuario puede jugar:', error);
    return false;
  }
};

/**
 * Obtiene estadísticas del juego
 * @param {string} gameId - ID del juego
 * @returns {Promise<Object>} Estadísticas del juego
 */
export const getGameStats = async (gameId) => {
  try {
    const game = await getGameById(gameId);
    if (!game) return null;

    // Obtener número de participantes
    const participantsRef = collection(db, 'userCards');
    const participantsQuery = query(
      participantsRef,
      where('gameId', '==', gameId),
      where('status', '==', 'active')
    );
    const participantsSnapshot = await getDocs(participantsQuery);

    return {
      totalParticipants: participantsSnapshot.size,
      gameStatus: game.status || 'pending',
      startTime: game.startTime,
      endTime: game.endTime
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas del juego:', error);
    throw error;
  }
};

export const gameService = {
  getActiveGamesList,
  getAllGamesList,
  getRecentGamesList,
  getGameById,
  canUserPlayGame,
  getGameStats
};