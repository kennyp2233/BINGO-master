/**
 * Servicio para gestión de información de eventos
 */

/**
 * Obtiene la información del evento actual desde los parámetros de URL
 * @param {URLSearchParams} searchParams - Parámetros de búsqueda de la URL
 * @returns {Object} Información del evento
 */
export const getEventInfoFromUrl = (searchParams) => {
  try {
    return {
      id: searchParams.get('id'),
      name: searchParams.get('name'),
      date: searchParams.get('date'),
      transmition: searchParams.get('transmition')
    };
  } catch (error) {
    console.error('Error obteniendo información del evento:', error);
    return {};
  }
};

/**
 * Construye la URL de transmisión del evento
 * @param {string} baseUrl - URL base
 * @param {Object} eventInfo - Información del evento
 * @returns {string} URL completa
 */
export const buildTransmissionUrl = (baseUrl, eventInfo) => {
  try {
    if (!baseUrl) return eventInfo.transmition || '';

    // Aquí se podría implementar lógica para construir URLs dinámicas
    return eventInfo.transmition || baseUrl;
  } catch (error) {
    console.error('Error construyendo URL de transmisión:', error);
    return '';
  }
};

/**
 * Formatea la fecha del evento para display
 * @param {string|Date} date - Fecha del evento
 * @returns {string} Fecha formateada
 */
export const formatEventDate = (date) => {
  try {
    if (!date) return '';

    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formateando fecha del evento:', error);
    return String(date || '');
  }
};

export const eventService = {
  getEventInfoFromUrl,
  buildTransmissionUrl,
  formatEventDate
};