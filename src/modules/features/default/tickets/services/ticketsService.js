/**
 * Servicio para operaciones relacionadas con las cartillas del usuario
 */

import { gameService } from '../../dashboard';
import { getCardsByEventUsers } from '../../../admin/cards';

/**
 * Obtiene todas las cartillas de un usuario para un evento específico
 * @param {string} eventId - ID del evento
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Lista de cartillas
 */
export const getUserCardsForEvent = async (eventId, userId) => {
  try {
    const cards = await getCardsByEventUsers(eventId, userId);
    return cards;
  } catch (error) {
    console.error('Error obteniendo cartillas del usuario para el evento:', error);
    throw error;
  }
};

/**
 * Obtiene la lista de todos los eventos disponibles
 * @returns {Promise<Array>} Lista de eventos
 */
export const getAllEvents = async () => {
  try {
    const events = await gameService.getAllGamesList();
    return events;
  } catch (error) {
    console.error('Error obteniendo lista de eventos:', error);
    throw error;
  }
};

/**
 * Obtiene información detallada de una cartilla específica
 * @param {string} cardId - ID de la cartilla
 * @param {Array} userCards - Lista de cartillas del usuario
 * @returns {Object|null} Información de la cartilla
 */
export const getCardDetails = (cardId, userCards) => {
  try {
    const card = userCards.find(c => c.id === cardId);
    return card || null;
  } catch (error) {
    console.error('Error obteniendo detalles de cartilla:', error);
    return null;
  }
};

/**
 * Formatea el número de cartilla para mostrar
 * @param {number} cardNumber - Número de la cartilla
 * @returns {string} Número formateado
 */
export const formatCardNumber = (cardNumber) => {
  try {
    return `00000${cardNumber}`;
  } catch (error) {
    console.error('Error formateando número de cartilla:', error);
    return cardNumber.toString();
  }
};

export const ticketsService = {
  getUserCardsForEvent,
  getAllEvents,
  getCardDetails,
  formatCardNumber
};