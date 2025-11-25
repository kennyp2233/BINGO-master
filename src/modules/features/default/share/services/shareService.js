/**
 * Servicio para compartir enlaces de invitación
 */

/**
 * Genera un enlace de invitación para un usuario
 * @param {string} userId - ID del usuario que invita
 * @returns {string} Enlace de invitación completo
 */
export const generateInvitationLink = (userId) => {
  try {
    const baseUrl = window.location.origin;
    return `${baseUrl}/auth/join/?id=${userId}`;
  } catch (error) {
    console.error('Error generando enlace de invitación:', error);
    throw error;
  }
};

/**
 * Obtiene la información necesaria para compartir
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Información para compartir
 */
export const getShareInfo = async (userId) => {
  try {
    const invitationLink = generateInvitationLink(userId);

    return {
      invitationLink,
      shareMessage: 'Hola : ), juntos hacia la construcción de un mejor futuro. Únete a 👉KHUSKA👈',
      hashtags: '#KHUSKA'
    };
  } catch (error) {
    console.error('Error obteniendo información para compartir:', error);
    throw error;
  }
};

/**
 * Copia el enlace al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} True si se copió exitosamente
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copiando al portapapeles:', error);
    // Fallback para navegadores que no soportan clipboard API
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

export const shareService = {
  generateInvitationLink,
  getShareInfo,
  copyToClipboard
};