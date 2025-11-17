/**
 * PDF Layout Manager
 * Handles page layout, card positioning, and pagination
 */

import { PDF_CONFIG, calculateCardPosition } from 'modules/shared/constants/pdf-config';

/**
 * Organize cards into pages
 * @param {Array} cards - Array of bingo cards
 * @returns {Array} Array of pages, each containing up to CARDS_PER_PAGE cards
 */
export function organizeCardsIntoPages(cards) {
  const { CARDS_PER_PAGE } = PDF_CONFIG.CARD;
  const pages = [];

  for (let i = 0; i < cards.length; i += CARDS_PER_PAGE) {
    pages.push(cards.slice(i, i + CARDS_PER_PAGE));
  }

  return pages;
}

/**
 * Get card positions for a page
 * @param {number} cardsOnPage - Number of cards on this page (1-4)
 * @returns {Array<{x: number, y: number}>} Array of positions
 */
export function getCardPositions(cardsOnPage) {
  const positions = [];

  for (let i = 0; i < cardsOnPage; i++) {
    positions.push(calculateCardPosition(i));
  }

  return positions;
}

/**
 * Calculate total number of pages needed
 * @param {number} totalCards - Total number of cards
 * @returns {number} Number of pages
 */
export function calculateTotalPages(totalCards) {
  const { CARDS_PER_PAGE } = PDF_CONFIG.CARD;
  return Math.ceil(totalCards / CARDS_PER_PAGE);
}

/**
 * Get page info for a card index
 * @param {number} cardIndex - Global card index
 * @returns {{pageNumber: number, positionOnPage: number}} Page info
 */
export function getCardPageInfo(cardIndex) {
  const { CARDS_PER_PAGE } = PDF_CONFIG.CARD;

  return {
    pageNumber: Math.floor(cardIndex / CARDS_PER_PAGE),
    positionOnPage: cardIndex % CARDS_PER_PAGE
  };
}
