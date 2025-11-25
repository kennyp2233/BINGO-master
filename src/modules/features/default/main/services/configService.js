/**
 * Servicio para gestión de configuración de la aplicación
 */

/**
 * Obtiene la configuración de bingo desde localStorage
 * @returns {Object} Configuración de bingo
 */
export const getBingoConfig = () => {
  try {
    const config = localStorage.getItem('bingoConfig');
    return config ? JSON.parse(config) : {};
  } catch (error) {
    console.error('Error obteniendo configuración de bingo:', error);
    return {};
  }
};

/**
 * Guarda la configuración de bingo en localStorage
 * @param {Object} config - Configuración de bingo
 */
export const saveBingoConfig = (config) => {
  try {
    localStorage.setItem('bingoConfig', JSON.stringify(config));
  } catch (error) {
    console.error('Error guardando configuración de bingo:', error);
  }
};

/**
 * Obtiene la configuración de Payphone desde localStorage
 * @returns {Object} Configuración de Payphone
 */
export const getPayphoneConfig = () => {
  try {
    const config = localStorage.getItem('payphoneConfig');
    return config ? JSON.parse(config) : {};
  } catch (error) {
    console.error('Error obteniendo configuración de Payphone:', error);
    return {};
  }
};

/**
 * Guarda la configuración de Payphone en localStorage
 * @param {Object} config - Configuración de Payphone
 */
export const savePayphoneConfig = (config) => {
  try {
    localStorage.setItem('payphoneConfig', JSON.stringify(config));
  } catch (error) {
    console.error('Error guardando configuración de Payphone:', error);
  }
};

/**
 * Obtiene la configuración de términos y condiciones
 * @returns {boolean} Estado de aceptación de términos
 */
export const getTermsAccepted = () => {
  try {
    return localStorage.getItem('termsAccepted') === 'true';
  } catch (error) {
    console.error('Error obteniendo estado de términos:', error);
    return false;
  }
};

/**
 * Guarda el estado de aceptación de términos
 * @param {boolean} accepted - Estado de aceptación
 */
export const saveTermsAccepted = (accepted) => {
  try {
    localStorage.setItem('termsAccepted', String(accepted));
  } catch (error) {
    console.error('Error guardando estado de términos:', error);
  }
};

/**
 * Limpia toda la configuración del localStorage
 */
export const clearAllConfig = () => {
  try {
    localStorage.removeItem('bingoConfig');
    localStorage.removeItem('payphoneConfig');
    localStorage.removeItem('termsAccepted');
  } catch (error) {
    console.error('Error limpiando configuración:', error);
  }
};

export const configService = {
  getBingoConfig,
  saveBingoConfig,
  getPayphoneConfig,
  savePayphoneConfig,
  getTermsAccepted,
  saveTermsAccepted,
  clearAllConfig
};