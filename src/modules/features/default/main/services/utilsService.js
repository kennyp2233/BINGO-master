/**
 * Servicio de utilidades generales
 */

/**
 * Genera un ID único
 * @param {number} length - Longitud del ID
 * @returns {string} ID generado
 */
export const generateId = (length = 8) => {
  try {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  } catch (error) {
    console.error('Error generando ID:', error);
    return Date.now().toString();
  }
};

/**
 * Formatea un número como moneda
 * @param {number} amount - Monto a formatear
 * @param {string} currency - Moneda (default: USD)
 * @returns {string} Monto formateado
 */
export const formatCurrency = (amount, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  } catch (error) {
    console.error('Error formateando moneda:', error);
    return `${currency} ${amount}`;
  }
};

/**
 * Formatea una fecha
 * @param {Date|string} date - Fecha a formatear
 * @param {Object} options - Opciones de formato
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, options = {}) => {
  try {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };

    return new Date(date).toLocaleDateString('es-ES', defaultOptions);
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return String(date);
  }
};

/**
 * Capitaliza la primera letra de una cadena
 * @param {string} str - Cadena a capitalizar
 * @returns {string} Cadena capitalizada
 */
export const capitalize = (str) => {
  try {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  } catch (error) {
    console.error('Error capitalizando cadena:', error);
    return str;
  }
};

/**
 * Trunca una cadena a una longitud específica
 * @param {string} str - Cadena a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo para indicar truncamiento
 * @returns {string} Cadena truncada
 */
export const truncate = (str, maxLength = 50, suffix = '...') => {
  try {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
  } catch (error) {
    console.error('Error truncando cadena:', error);
    return str;
  }
};

/**
 * Verifica si un valor está vacío
 * @param {*} value - Valor a verificar
 * @returns {boolean} True si está vacío
 */
export const isEmpty = (value) => {
  try {
    if (value == null) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  } catch (error) {
    console.error('Error verificando si está vacío:', error);
    return true;
  }
};

/**
 * Debounce para funciones
 * @param {Function} func - Función a debounced
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounced
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} True si se copió correctamente
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copiando al portapapeles:', error);
    // Fallback para navegadores antiguos
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      console.error('Error en fallback de copiado:', fallbackError);
      return false;
    }
  }
};

/**
 * Descarga un archivo
 * @param {string} content - Contenido del archivo
 * @param {string} filename - Nombre del archivo
 * @param {string} mimeType - Tipo MIME
 */
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error descargando archivo:', error);
  }
};

export const utilsService = {
  generateId,
  formatCurrency,
  formatDate,
  capitalize,
  truncate,
  isEmpty,
  debounce,
  copyToClipboard,
  downloadFile
};