/**
 * PDF Configuration Constants
 * Centralized configuration for BINGO PDF generation
 */

export const PDF_CONFIG = {
  // Page dimensions (A4 in mm)
  PAGE: {
    WIDTH: 210,
    HEIGHT: 297,
    MARGIN: 10,
    ORIENTATION: 'portrait'
  },

  // Card layout
  CARD: {
    WIDTH: 90, // Width in mm
    HEIGHT: 105, // Height in mm
    PADDING: 5,
    BORDER_WIDTH: 1.5,
    BORDER_COLOR: [32, 163, 55], // #20a337 - Verde
    BORDER_RADIUS: 3,
    CARDS_PER_ROW: 2,
    CARDS_PER_PAGE: 4, // 2x2 grid
    SPACING_X: 5, // Horizontal spacing between cards
    SPACING_Y: 5 // Vertical spacing between cards
  },

  // Cell configuration for BINGO grid
  CELL: {
    SIZE: 14, // Cell size in mm
    BORDER_WIDTH: 0.5,
    BORDER_COLOR: [255, 238, 0], // #ffee00 - Amarillo
    FONT_SIZE: 12,
    HEADER_FONT_SIZE: 14,
    HEADER_HEIGHT: 16
  },

  // Colors
  COLORS: {
    PRIMARY: [32, 163, 55], // #20a337 - Verde
    SECONDARY: [255, 238, 0], // #ffee00 - Amarillo
    TEXT: [0, 0, 0], // Negro
    TEXT_LIGHT: [102, 102, 102], // #666666 - Gris
    WHITE: [255, 255, 255],
    BACKGROUND: [255, 255, 255],
    FREE_CELL_BG: [255, 238, 0], // Amarillo para celda FREE
    FREE_CELL_TEXT: [32, 163, 55] // Verde para texto FREE
  },

  // Typography
  FONTS: {
    REGULAR: 'helvetica',
    BOLD: 'helvetica',
    STYLES: {
      NORMAL: 'normal',
      BOLD: 'bold'
    }
  },

  // Header configuration
  HEADER: {
    HEIGHT: 25, // Header height in mm
    FONT_SIZE_TITLE: 14,
    FONT_SIZE_INFO: 10,
    PADDING_BOTTOM: 3,
    BORDER_BOTTOM_WIDTH: 0.5
  },

  // Watermarks
  WATERMARK: {
    LOGO_CONTRACT: {
      WIDTH: 30, // Width in mm
      OPACITY: 0.1,
      POSITION: 'center' // center of card
    },
    LOGO_COMPANY: {
      WIDTH: 20, // Width in mm
      OPACITY: 0.1,
      POSITION: 'top-right' // top right corner
    }
  },

  // Card info text
  CARD_INFO: {
    FONT_SIZE_NUMBER: 12,
    FONT_SIZE_ID: 7,
    SPACING: 3
  }
};

/**
 * Calculate card positions on page
 * @param {number} cardIndex - Index of card on current page (0-3)
 * @returns {{x: number, y: number}} Position in mm
 */
export function calculateCardPosition(cardIndex) {
  const { PAGE, CARD } = PDF_CONFIG;

  const row = Math.floor(cardIndex / CARD.CARDS_PER_ROW);
  const col = cardIndex % CARD.CARDS_PER_ROW;

  const availableWidth = PAGE.WIDTH - (2 * PAGE.MARGIN);
  const availableHeight = PAGE.HEIGHT - (2 * PAGE.MARGIN) - PDF_CONFIG.HEADER.HEIGHT;

  const totalCardsWidth = (CARD.WIDTH * CARD.CARDS_PER_ROW) + (CARD.SPACING_X * (CARD.CARDS_PER_ROW - 1));
  const totalCardsHeight = (CARD.HEIGHT * 2) + CARD.SPACING_Y;

  const startX = PAGE.MARGIN + (availableWidth - totalCardsWidth) / 2;
  const startY = PAGE.MARGIN + PDF_CONFIG.HEADER.HEIGHT + 5;

  return {
    x: startX + (col * (CARD.WIDTH + CARD.SPACING_X)),
    y: startY + (row * (CARD.HEIGHT + CARD.SPACING_Y))
  };
}

/**
 * Get BINGO letters
 * @returns {string[]} Array of letters ['B', 'I', 'N', 'G', 'O']
 */
export function getBingoLetters() {
  return ['B', 'I', 'N', 'G', 'O'];
}
