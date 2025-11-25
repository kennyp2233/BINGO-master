/**
 * Servicio para gestión de usuarios
 */

/**
 * Obtiene información del usuario desde localStorage
 * @returns {Object} Información del usuario
 */
export const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error obteniendo usuario del storage:', error);
    return null;
  }
};

/**
 * Guarda información del usuario en localStorage
 * @param {Object} user - Información del usuario
 */
export const saveUserToStorage = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error guardando usuario en storage:', error);
  }
};

/**
 * Limpia la información del usuario del localStorage
 */
export const clearUserFromStorage = () => {
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error limpiando usuario del storage:', error);
  }
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} True si está autenticado
 */
export const isUserAuthenticated = () => {
  try {
    const user = getUserFromStorage();
    return user && user.uid;
  } catch (error) {
    console.error('Error verificando autenticación:', error);
    return false;
  }
};

/**
 * Obtiene el ID del usuario actual
 * @returns {string|null} ID del usuario
 */
export const getCurrentUserId = () => {
  try {
    const user = getUserFromStorage();
    return user ? user.uid : null;
  } catch (error) {
    console.error('Error obteniendo ID del usuario:', error);
    return null;
  }
};

export const userService = {
  getUserFromStorage,
  saveUserToStorage,
  clearUserFromStorage,
  isUserAuthenticated,
  getCurrentUserId
};