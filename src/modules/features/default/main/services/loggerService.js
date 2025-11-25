/**
 * Servicio para gestión de logs y mensajes
 */

/**
 * Registra un mensaje de log en la consola
 * @param {string} level - Nivel del log (info, warn, error)
 * @param {string} message - Mensaje a loguear
 * @param {Object} data - Datos adicionales opcionales
 */
export const logMessage = (level, message, data = null) => {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(data && { data })
    };

    switch (level) {
      case 'error':
        console.error(`[${timestamp}] ERROR:`, message, data || '');
        break;
      case 'warn':
        console.warn(`[${timestamp}] WARN:`, message, data || '');
        break;
      case 'info':
      default:
        console.info(`[${timestamp}] INFO:`, message, data || '');
        break;
    }

    // Aquí se podría implementar envío a servicio de logging remoto
    return logEntry;
  } catch (error) {
    console.error('Error en logMessage:', error);
  }
};

/**
 * Registra un error con contexto adicional
 * @param {Error} error - Error a loguear
 * @param {string} context - Contexto donde ocurrió el error
 * @param {Object} additionalData - Datos adicionales
 */
export const logError = (error, context = '', additionalData = {}) => {
  try {
    const errorData = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
      ...additionalData
    };

    return logMessage('error', `Error en ${context}: ${error.message}`, errorData);
  } catch (logError) {
    console.error('Error en logError:', logError);
  }
};

/**
 * Registra una operación exitosa
 * @param {string} operation - Nombre de la operación
 * @param {Object} data - Datos de la operación
 */
export const logSuccess = (operation, data = {}) => {
  return logMessage('info', `Operación exitosa: ${operation}`, data);
};

/**
 * Registra una advertencia
 * @param {string} message - Mensaje de advertencia
 * @param {Object} data - Datos adicionales
 */
export const logWarning = (message, data = {}) => {
  return logMessage('warn', message, data);
};

/**
 * Obtiene mensajes de error predefinidos
 * @param {string} key - Clave del mensaje
 * @returns {string} Mensaje de error
 */
export const getErrorMessage = (key) => {
  const messages = {
    'auth/invalid-email': 'Correo electrónico inválido',
    'auth/user-disabled': 'Usuario deshabilitado',
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'El correo ya está en uso',
    'auth/weak-password': 'La contraseña es muy débil',
    'payment/failed': 'Pago fallido',
    'network/error': 'Error de conexión',
    'validation/error': 'Error de validación',
    'general/error': 'Ha ocurrido un error inesperado'
  };

  return messages[key] || messages['general/error'];
};

/**
 * Obtiene mensajes de éxito predefinidos
 * @param {string} key - Clave del mensaje
 * @returns {string} Mensaje de éxito
 */
export const getSuccessMessage = (key) => {
  const messages = {
    'auth/login': 'Inicio de sesión exitoso',
    'auth/register': 'Registro exitoso',
    'payment/success': 'Pago procesado correctamente',
    'game/join': 'Te has unido al juego',
    'game/win': '¡Felicidades! Has ganado',
    'config/saved': 'Configuración guardada'
  };

  return messages[key] || 'Operación completada';
};

export const loggerService = {
  logMessage,
  logError,
  logSuccess,
  logWarning,
  getErrorMessage,
  getSuccessMessage
};