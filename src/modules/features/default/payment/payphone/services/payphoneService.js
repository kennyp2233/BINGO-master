/**
 * Servicio para operaciones de Payphone
 */

import { v4 as uuidv4 } from 'uuid';
import { PAYPHONE_CONFIG } from 'store/constant';

const { TOKEN, STORE_ID } = PAYPHONE_CONFIG;

/**
 * Configura un botón de pago de Payphone
 * @param {number} totalValue - Valor total a pagar
 * @param {Object} invoiceData - Datos de la factura
 * @returns {Object} Configuración del botón de pago
 */
export const configurePayphoneButton = (totalValue, invoiceData) => {
  try {
    const total = parseInt(totalValue * 100); // Convertir a centavos
    const clientTransactionId = uuidv4();

    // Construir la URL de respuesta dinámica basada en el dominio actual
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const responseUrl = `${baseUrl}/app/payment-response`;

    const config = {
      token: TOKEN,
      amount: total, // Monto total en centavos (suma de todos los componentes)
      amountWithoutTax: total, // Monto sin impuestos en centavos
      amountWithTax: 0, // Monto con impuestos en centavos
      tax: 0, // Monto del impuesto en centavos
      service: 0, // Monto del servicio en centavos
      tip: 0, // Monto de la propina en centavos
      currency: "USD", // Moneda ISO 4217
      clientTransactionId, // ID único de transacción del cliente
      storeId: STORE_ID, // ID de la sucursal
      reference: invoiceData.reference || 'Pago cartillas de Bingo', // Referencia del pago
      responseUrl, // URL de respuesta después del pago
      cancellationUrl: `${baseUrl}/app/dashboard`, // URL de cancelación
      lang: "es", // Idioma: español
      defaultMethod: "card", // Método por defecto: tarjeta
      timeZone: -5, // Zona horaria Ecuador
      lat: "-1.831239", // Latitud (Quito)
      lng: "-78.183406" // Longitud (Quito)
    };

    // Guardar en localStorage para el procesamiento posterior
    localStorage.setItem(
      'pyphone_trx',
      JSON.stringify({
        clientTransactionId,
        invoiceData: {
          ...invoiceData,
          totalValue
        }
      })
    );

    return config;
  } catch (error) {
    console.error('Error configurando botón de Payphone:', error);
    throw error;
  }
};

/**
 * Obtiene la transacción almacenada en localStorage
 * @returns {Object|null} Datos de la transacción
 */
export const getStoredTransaction = () => {
  try {
    const stored = localStorage.getItem('pyphone_trx');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error obteniendo transacción almacenada:', error);
    return null;
  }
};

/**
 * Limpia la transacción almacenada
 */
export const clearStoredTransaction = () => {
  try {
    localStorage.removeItem('pyphone_trx');
  } catch (error) {
    console.error('Error limpiando transacción almacenada:', error);
  }
};

export const payphoneService = {
  configurePayphoneButton,
  getStoredTransaction,
  clearStoredTransaction
};