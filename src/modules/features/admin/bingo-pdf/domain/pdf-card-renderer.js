/**
 * PDF Card Renderer
 * Renders BINGO cards directly to PDF using jsPDF primitives
 * NO html2canvas - Pure vector graphics
 */

import { PDF_CONFIG, getBingoLetters } from 'modules/shared/constants/pdf-config';
import { calculateScaledDimensions } from 'modules/shared/utils/image-loader';

/**
 * Render a single BINGO card on PDF
 * @param {Object} pdf - jsPDF instance
 * @param {Object} card - Bingo card data
 * @param {number} x - X position in mm
 * @param {number} y - Y position in mm
 * @param {string} logo1Base64 - Contract watermark (base64)
 * @param {string} logo2Base64 - Company watermark (base64)
 */
export function renderBingoCard(pdf, card, x, y, logo1Base64, logo2Base64) {
  const { CARD, CELL, COLORS, FONTS, CARD_INFO, WATERMARK } = PDF_CONFIG;

  // Save current state
  pdf.saveGraphicsState();

  // 1. Draw card border
  pdf.setDrawColor(...CARD.BORDER_COLOR);
  pdf.setLineWidth(CARD.BORDER_WIDTH);
  pdf.roundedRect(x, y, CARD.WIDTH, CARD.HEIGHT, CARD.BORDER_RADIUS, CARD.BORDER_RADIUS, 'S');

  // 2. Draw card number at top
  pdf.setFont(FONTS.BOLD, FONTS.STYLES.BOLD);
  pdf.setFontSize(CARD_INFO.FONT_SIZE_NUMBER);
  pdf.setTextColor(...COLORS.TEXT);
  const cardNumberText = `Cartilla #${card.order || '?'}`;
  const cardNumberWidth = pdf.getTextWidth(cardNumberText);
  pdf.text(cardNumberText, x + (CARD.WIDTH / 2) - (cardNumberWidth / 2), y + CARD.PADDING + 4);

  // 3. Draw BINGO grid (centered)
  const gridStartY = y + CARD.PADDING + 8;
  const gridWidth = CELL.SIZE * 5; // 5 columns
  const availableWidth = CARD.WIDTH - (CARD.PADDING * 2);
  const gridOffsetX = (availableWidth - gridWidth) / 2;
  renderBingoGrid(pdf, card, x + CARD.PADDING + gridOffsetX, gridStartY);

  // 4. Draw card ID at bottom
  pdf.setFont(FONTS.REGULAR, FONTS.STYLES.NORMAL);
  pdf.setFontSize(CARD_INFO.FONT_SIZE_ID);
  pdf.setTextColor(...COLORS.TEXT_LIGHT);
  const idText = `ID: ${card.id || 'N/A'}`;
  const idWidth = pdf.getTextWidth(idText);
  pdf.text(idText, x + (CARD.WIDTH / 2) - (idWidth / 2), y + CARD.HEIGHT - CARD.PADDING);

  // 5. Add watermarks
  if (logo1Base64) {
    addCenterWatermark(pdf, logo1Base64, x, y, CARD.WIDTH, CARD.HEIGHT);
  }
  if (logo2Base64) {
    addCornerWatermark(pdf, logo2Base64, x, y, CARD.WIDTH);
  }

  // Restore state
  pdf.restoreGraphicsState();
}

/**
 * Render BINGO grid (5x6: headers + 5 rows)
 */
function renderBingoGrid(pdf, card, startX, startY) {
  const { CELL, COLORS, FONTS } = PDF_CONFIG;
  const letters = getBingoLetters();

  let currentY = startY;

  // Render header row (B I N G O)
  pdf.setFont(FONTS.BOLD, FONTS.STYLES.BOLD);
  pdf.setFontSize(CELL.HEADER_FONT_SIZE);

  letters.forEach((letter, colIndex) => {
    const cellX = startX + (colIndex * CELL.SIZE);

    // Header background (verde)
    pdf.setFillColor(...COLORS.PRIMARY);
    pdf.rect(cellX, currentY, CELL.SIZE, CELL.HEADER_HEIGHT, 'F');

    // Header text
    pdf.setTextColor(...COLORS.WHITE);
    const letterWidth = pdf.getTextWidth(letter);
    pdf.text(letter, cellX + (CELL.SIZE / 2) - (letterWidth / 2), currentY + (CELL.HEADER_HEIGHT / 2) + 2);
  });

  currentY += CELL.HEADER_HEIGHT;

  // Render 5 number rows
  pdf.setFont(FONTS.REGULAR, FONTS.STYLES.NORMAL);
  pdf.setFontSize(CELL.FONT_SIZE);

  for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
    letters.forEach((letter, colIndex) => {
      const cellX = startX + (colIndex * CELL.SIZE);
      const cellY = currentY + (rowIndex * CELL.SIZE);

      const value = card[letter.toLowerCase()][rowIndex];
      const isFreeCell = value === 'FREE';

      // Cell background
      if (isFreeCell) {
        pdf.setFillColor(...COLORS.FREE_CELL_BG); // Amarillo
        pdf.rect(cellX, cellY, CELL.SIZE, CELL.SIZE, 'F');
      } else {
        pdf.setFillColor(...COLORS.WHITE);
        pdf.rect(cellX, cellY, CELL.SIZE, CELL.SIZE, 'F');
      }

      // Cell border
      pdf.setDrawColor(...COLORS.SECONDARY); // Amarillo
      pdf.setLineWidth(CELL.BORDER_WIDTH);
      pdf.rect(cellX, cellY, CELL.SIZE, CELL.SIZE, 'S');

      // Cell text
      const displayValue = isFreeCell ? 'F' : value.toString();
      const textColor = isFreeCell ? COLORS.FREE_CELL_TEXT : COLORS.TEXT;
      pdf.setTextColor(...textColor);

      const textWidth = pdf.getTextWidth(displayValue);
      const textX = cellX + (CELL.SIZE / 2) - (textWidth / 2);
      const textY = cellY + (CELL.SIZE / 2) + 2;

      pdf.text(displayValue, textX, textY);
    });
  }
}

/**
 * Add center watermark (logo-contrato.png)
 */
function addCenterWatermark(pdf, base64Image, cardX, cardY, cardWidth, cardHeight) {
  const { WATERMARK } = PDF_CONFIG;
  const config = WATERMARK.LOGO_CONTRACT;

  // Calculate dimensions maintaining aspect ratio
  const imgWidth = config.WIDTH;
  const imgHeight = config.WIDTH; // Assume square for watermark

  const x = cardX + (cardWidth / 2) - (imgWidth / 2);
  const y = cardY + (cardHeight / 2) - (imgHeight / 2);

  pdf.saveGraphicsState();
  pdf.setGState(new pdf.GState({ opacity: config.OPACITY }));

  try {
    pdf.addImage(base64Image, 'PNG', x, y, imgWidth, imgHeight);
  } catch (error) {
    console.warn('Failed to add center watermark:', error);
  }

  pdf.restoreGraphicsState();
}

/**
 * Add top-right corner watermark (logo-empresa.png)
 */
function addCornerWatermark(pdf, base64Image, cardX, cardY, cardWidth) {
  const { WATERMARK, CARD } = PDF_CONFIG;
  const config = WATERMARK.LOGO_COMPANY;

  const imgWidth = config.WIDTH;
  const imgHeight = config.WIDTH; // Assume square

  const x = cardX + cardWidth - imgWidth - (CARD.PADDING + 2);
  const y = cardY + CARD.PADDING + 2;

  pdf.saveGraphicsState();
  pdf.setGState(new pdf.GState({ opacity: config.OPACITY }));

  try {
    pdf.addImage(base64Image, 'PNG', x, y, imgWidth, imgHeight);
  } catch (error) {
    console.warn('Failed to add corner watermark:', error);
  }

  pdf.restoreGraphicsState();
}

/**
 * Render PDF header with event and user info
 */
export function renderPDFHeader(pdf, event, user) {
  const { PAGE, HEADER, FONTS, COLORS } = PDF_CONFIG;

  const startX = PAGE.MARGIN;
  const startY = PAGE.MARGIN;

  // Event name (left side)
  pdf.setFont(FONTS.BOLD, FONTS.STYLES.BOLD);
  pdf.setFontSize(HEADER.FONT_SIZE_TITLE);
  pdf.setTextColor(...COLORS.TEXT);
  pdf.text(event?.name || 'Evento de Bingo', startX, startY + 5);

  // Event date (left side, below title)
  pdf.setFont(FONTS.REGULAR, FONTS.STYLES.NORMAL);
  pdf.setFontSize(HEADER.FONT_SIZE_INFO);
  let dateText = 'Fecha: ';
  if (event?.startDate) {
    const date = new Date(event.startDate);
    dateText += date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } else {
    dateText += 'No especificada';
  }
  pdf.text(dateText, startX, startY + 11);

  // User info (right side)
  const rightX = PAGE.WIDTH - PAGE.MARGIN;
  const userText = `Usuario: ${user?.fullName || 'No especificado'}`;
  const userWidth = pdf.getTextWidth(userText);
  pdf.text(userText, rightX - userWidth, startY + 5);

  const emailText = `Correo: ${user?.email || 'No especificado'}`;
  const emailWidth = pdf.getTextWidth(emailText);
  pdf.text(emailText, rightX - emailWidth, startY + 11);

  // Bottom border
  pdf.setDrawColor(...COLORS.TEXT_LIGHT);
  pdf.setLineWidth(HEADER.BORDER_BOTTOM_WIDTH);
  pdf.line(startX, startY + HEADER.HEIGHT - HEADER.PADDING_BOTTOM, rightX, startY + HEADER.HEIGHT - HEADER.PADDING_BOTTOM);
}
