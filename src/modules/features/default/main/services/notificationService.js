/**
 * Servicio para gestión de notificaciones
 */

/**
 * Muestra una notificación de éxito
 * @param {string} message - Mensaje a mostrar
 * @param {Object} options - Opciones adicionales
 */
export const showSuccessNotification = (message, options = {}) => {
  try {
    // Aquí se implementaría la lógica para mostrar notificaciones
    // Por ejemplo, usando un sistema de notificaciones como toast
    console.log('SUCCESS:', message, options);

    // Placeholder para integración con sistema de notificaciones
    if (window.showToast) {
      window.showToast(message, 'success', options);
    }
  } catch (error) {
    console.error('Error mostrando notificación de éxito:', error);
  }
};

/**
 * Muestra una notificación de error
 * @param {string} message - Mensaje a mostrar
 * @param {Object} options - Opciones adicionales
 */
export const showErrorNotification = (message, options = {}) => {
  try {
    console.error('ERROR:', message, options);

    if (window.showToast) {
      window.showToast(message, 'error', options);
    }
  } catch (error) {
    console.error('Error mostrando notificación de error:', error);
  }
};

/**
 * Muestra una notificación de advertencia
 * @param {string} message - Mensaje a mostrar
 * @param {Object} options - Opciones adicionales
 */
export const showWarningNotification = (message, options = {}) => {
  try {
    console.warn('WARNING:', message, options);

    if (window.showToast) {
      window.showToast(message, 'warning', options);
    }
  } catch (error) {
    console.error('Error mostrando notificación de advertencia:', error);
  }
};

/**
 * Muestra una notificación de información
 * @param {string} message - Mensaje a mostrar
 * @param {Object} options - Opciones adicionales
 */
export const showInfoNotification = (message, options = {}) => {
  try {
    console.info('INFO:', message, options);

    if (window.showToast) {
      window.showToast(message, 'info', options);
    }
  } catch (error) {
    console.error('Error mostrando notificación de información:', error);
  }
};

/**
 * Muestra una notificación de carga
 * @param {string} message - Mensaje a mostrar
 * @param {Object} options - Opciones adicionales
 */
export const showLoadingNotification = (message, options = {}) => {
  try {
    console.log('LOADING:', message, options);

    if (window.showLoadingToast) {
      window.showLoadingToast(message, options);
    }
  } catch (error) {
    console.error('Error mostrando notificación de carga:', error);
  }
};

/**
 * Oculta la notificación de carga
 */
export const hideLoadingNotification = () => {
  try {
    if (window.hideLoadingToast) {
      window.hideLoadingToast();
    }
  } catch (error) {
    console.error('Error ocultando notificación de carga:', error);
  }
};

/**
 * Solicita permiso para notificaciones push
 * @returns {Promise<boolean>} True si se concedió el permiso
 */
export const requestNotificationPermission = async () => {
  try {
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta notificaciones');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error solicitando permiso de notificaciones:', error);
    return false;
  }
};

/**
 * Envía una notificación push nativa
 * @param {string} title - Título de la notificación
 * @param {Object} options - Opciones de la notificación
 */
export const sendPushNotification = (title, options = {}) => {
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  } catch (error) {
    console.error('Error enviando notificación push:', error);
  }
};

export const notificationService = {
  showSuccessNotification,
  showErrorNotification,
  showWarningNotification,
  showInfoNotification,
  showLoadingNotification,
  hideLoadingNotification,
  requestNotificationPermission,
  sendPushNotification
};