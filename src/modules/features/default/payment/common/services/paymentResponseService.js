/**
 * Servicio para operaciones de respuestas de pago
 */

import { db } from 'config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { collPayments } from 'store/collections';

/**
 * Obtiene un pago por ID de transacción
 * @param {string} transactionId - ID de la transacción
 * @param {string} clientTransactionId - ID de transacción del cliente
 * @returns {Promise<Object|null>} Datos del pago
 */
export const getPaymentByTransaction = async (transactionId, clientTransactionId) => {
  try {
    const paymentsRef = collection(db, collPayments);
    const q = query(
      paymentsRef,
      where('transactionId', '==', transactionId),
      where('clientTransactionId', '==', clientTransactionId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    }

    return null;
  } catch (error) {
    console.error('Error obteniendo pago por transacción:', error);
    throw error;
  }
};

/**
 * Guarda una nueva transacción de pago
 * @param {Object} transactionData - Datos de la transacción
 * @returns {Promise<Object>} Resultado de la operación
 */
export const savePaymentTransaction = async (transactionData) => {
  try {
    const paymentsRef = collection(db, collPayments);
    const docRef = await addDoc(paymentsRef, {
      ...transactionData,
      createdAt: new Date(),
      status: 'completed'
    });

    return {
      id: docRef.id,
      success: true
    };
  } catch (error) {
    console.error('Error guardando transacción de pago:', error);
    throw error;
  }
};

/**
 * Actualiza el estado de una transacción
 * @param {string} paymentId - ID del pago
 * @param {string} status - Nuevo estado
 * @returns {Promise<boolean>} True si se actualizó correctamente
 */
export const updatePaymentStatus = async (paymentId, status) => {
  try {
    const paymentRef = doc(db, 'payments', paymentId);
    await updateDoc(paymentRef, {
      status,
      updatedAt: new Date()
    });

    return true;
  } catch (error) {
    console.error('Error actualizando estado del pago:', error);
    throw error;
  }
};

/**
 * Valida si una transacción ya existe
 * @param {string} transactionId - ID de la transacción
 * @param {string} clientTransactionId - ID de transacción del cliente
 * @returns {Promise<boolean>} True si existe
 */
export const transactionExists = async (transactionId, clientTransactionId) => {
  try {
    const existing = await getPaymentByTransaction(transactionId, clientTransactionId);
    return existing !== null;
  } catch (error) {
    console.error('Error verificando existencia de transacción:', error);
    return false;
  }
};

export const paymentResponseService = {
  getPaymentByTransaction,
  savePaymentTransaction,
  updatePaymentStatus,
  transactionExists
};