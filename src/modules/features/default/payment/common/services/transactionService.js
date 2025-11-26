/**
 * Servicio para procesamiento de transacciones de pago
 */

import { db } from 'config/firebase';
import { collection, addDoc, updateDoc, doc, setDoc } from 'firebase/firestore';
import { PAYPHONE_CONFIG } from 'store/constant';
import { collUserCards, collCards } from 'store/collections';
import { generateId } from 'utils/idGenerator';
import { fullDate } from 'utils/validations';
import { paymentResponseService } from './paymentResponseService';

const { SERVER_URL, TOKEN } = PAYPHONE_CONFIG;

/**
 * Procesa una transacción de Payphone
 * @param {string} transactionId - ID de la transacción
 * @param {string} clientTransactionId - ID de transacción del cliente
 * @param {Object} storedTransaction - Datos almacenados de la transacción
 * @returns {Promise<Object>} Resultado de la transacción
 */
export const processTransaction = async (transactionId, clientTransactionId, storedTransaction) => {
  try {
    validateTransactionParams(transactionId, clientTransactionId);

    const requestData = {
      id: parseInt(transactionId, 10),
      clientTxId: clientTransactionId
    };

    const response = await fetchTransactionStatus(requestData);
    const result = await response.json();

    // Guardar detalles del pago usando el servicio
    await savePaymentDetails(
      storedTransaction,
      transactionId,
      clientTransactionId,
      result.statusCode
    );

    if (result.statusCode === 3) {
      const { cards, userId, userName, totalValue } = storedTransaction.invoiceData;
      await saveUserCards(cards, userId, userName);

      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Purchase', {
          value: isFinite(totalValue) ? totalValue : 0,
          currency: 'USD',
          content_type: 'bingo_cards',
          transaction_id: String(transactionId)
        });
      }
    }

    return result;
  } catch (error) {
    console.error('Error procesando transacción:', error);
    throw error;
  } finally {
    // Limpiar el local storage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('pyphone_trx');
    }
  }
};

/**
 * Consulta el estado de la transacción en Payphone
 * @param {Object} data - Datos de la consulta
 * @returns {Promise<Response>} Respuesta de la API
 */
const fetchTransactionStatus = async (data) => {
  const response = await fetch(SERVER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}, Detalles: ${errorText}`);
  }

  return response;
};

/**
 * Guarda las cartillas del usuario después del pago exitoso
 * @param {Array} cards - Cartillas compradas
 * @param {string} userId - ID del usuario
 * @param {string} userName - Nombre del usuario
 */
const saveUserCards = async (cards, userId, userName) => {
  try {
    for (const item of cards) {
      const idUserCard = generateId(10);
      const cardObject = {
        id: idUserCard,
        idCard: item.id,
        createAt: fullDate(),
        eventDate: null,
        eventId: item.event,
        eventName: item.eventName,
        bingoNumbers: item.bingoNumbers,
        b: item.b,
        i: item.i,
        n: item.n,
        g: item.g,
        o: item.o,
        num: item.num,
        order: item.order,
        state: 0,
        userId: userId,
        userName: userName,
        status: 'active'
      };

      // Usar setDoc con ID explícito en lugar de addDoc
      await setDoc(doc(db, collUserCards, idUserCard), cardObject);
      console.log(`✓ Cartilla ${item.num} asignada al usuario ${userName}`);

      // Actualizar estado de la cartilla original a "asignada" (0)
      await updateDoc(doc(db, collCards, item.id), { state: 0 });
      console.log(`✓ Cartilla ${item.num} marcada como no disponible`);
    }

    console.log(`✅ Total de ${cards.length} cartillas asignadas exitosamente`);
  } catch (error) {
    console.error('❌ Error guardando cartillas del usuario:', error);
    throw error;
  }
};

/**
 * Guarda los detalles del pago
 * @param {Object} storedTransaction - Datos almacenados
 * @param {string} transactionId - ID de transacción
 * @param {string} clientTransactionId - ID de transacción del cliente
 * @param {number} statusCode - Código de estado
 */
const savePaymentDetails = async (storedTransaction, transactionId, clientTransactionId, statusCode) => {
  try {
    const { userId, userName, reference, totalValue, cards, eventId } = storedTransaction.invoiceData;
    const cardsNumbers = cards.map((item) => item.num).join(', ');

    const payment = {
      id: generateId(10),
      createAt: fullDate(),
      userId,
      userName,
      details: reference,
      card: cardsNumbers,
      total: totalValue,
      transactionId,
      clientTransactionId,
      statusCode,
      eventId,
      status: statusCode === 3 ? 'Aprobado' : 'Cancelado',
      provider: 'PayPhone'
    };

    await paymentResponseService.savePaymentTransaction(payment);
  } catch (error) {
    console.error('Error guardando detalles del pago:', error);
    throw error;
  }
};

/**
 * Valida los parámetros de la transacción
 * @param {string} transactionId - ID de la transacción
 * @param {string} clientTransactionId - ID de transacción del cliente
 */
const validateTransactionParams = (transactionId, clientTransactionId) => {
  if (!transactionId || !clientTransactionId) {
    throw new Error('Faltan parámetros en la URL.');
  }
};

export const transactionService = {
  processTransaction,
  validateTransactionParams
};