/**
 * Servicio para gestión completa de términos y condiciones
 */

import { db } from 'config/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Verifica si los términos y condiciones han sido aceptados
 * @returns {boolean} True si han sido aceptados
 */
export const checkTermsAccepted = () => {
  try {
    const storedTermsAccepted = localStorage.getItem('termsAccepted');
    return storedTermsAccepted === 'true';
  } catch (error) {
    console.error('Error verificando términos aceptados:', error);
    return false;
  }
};

/**
 * Acepta los términos y condiciones
 * @returns {void}
 */
export const acceptTerms = () => {
  try {
    localStorage.setItem('termsAccepted', 'true');
  } catch (error) {
    console.error('Error aceptando términos:', error);
    throw error;
  }
};

/**
 * Obtiene los términos y condiciones desde Firestore
 * @returns {Promise<Object>} Términos y condiciones
 */
export const getTermsAndConditions = async () => {
  try {
    const docRef = doc(db, 'config', 'termsAndConditions');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      // Términos por defecto si no existen en la BD
      return {
        title: 'Términos y Condiciones',
        content: 'Por favor acepte los términos y condiciones para continuar.',
        version: '1.0',
        lastUpdated: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error obteniendo términos y condiciones:', error);
    throw error;
  }
};

/**
 * Valida si los términos están aceptados
 * @param {boolean} accepted - Estado de aceptación
 * @returns {boolean} True si están aceptados
 */
export const validateTermsAcceptance = (accepted) => {
  return Boolean(accepted);
};

/**
 * Obtiene la versión actual de los términos
 * @returns {Promise<string>} Versión de los términos
 */
export const getTermsVersion = async () => {
  try {
    const terms = await getTermsAndConditions();
    return terms.version || '1.0';
  } catch (error) {
    console.error('Error obteniendo versión de términos:', error);
    return '1.0';
  }
};

export const termsService = {
  checkTermsAccepted,
  acceptTerms,
  getTermsAndConditions,
  validateTermsAcceptance,
  getTermsVersion
};