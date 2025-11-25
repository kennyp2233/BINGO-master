/**
 * Servicio para validaciones de compra y negocio
 */

/**
 * Valida si se puede proceder con el pago
 * @param {Array} selectedItems - Items seleccionados
 * @param {boolean} termsAccepted - Si los términos están aceptados
 * @param {Function} onPaymentAttempt - Callback opcional
 * @returns {boolean} True si puede proceder
 */
export const canProceedWithPayment = (selectedItems, termsAccepted, onPaymentAttempt) => {
  try {
    const minCards = 5;
    const hasEnoughCards = selectedItems.length >= minCards;
    const hasAcceptedTerms = termsAccepted;

    let canProceed = hasEnoughCards && hasAcceptedTerms;

    if (onPaymentAttempt) {
      canProceed = onPaymentAttempt() && canProceed;
    }

    return canProceed;
  } catch (error) {
    console.error('Error validando pago:', error);
    return false;
  }
};

/**
 * Valida los parámetros de una transacción
 * @param {string} transactionId - ID de la transacción
 * @param {string} clientTransactionId - ID de transacción del cliente
 */
export const validateTransactionParams = (transactionId, clientTransactionId) => {
  if (!transactionId || !clientTransactionId) {
    throw new Error('Faltan parámetros en la URL.');
  }
};

/**
 * Valida que una cantidad sea finita y positiva
 * @param {number} amount - Cantidad a validar
 * @returns {boolean} True si es válida
 */
export const isValidAmount = (amount) => {
  return isFinite(amount) && amount > 0;
};

export const validationService = {
  canProceedWithPayment,
  validateTransactionParams,
  isValidAmount
};