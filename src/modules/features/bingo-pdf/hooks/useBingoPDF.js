/**
 * useBingoPDF Hook
 * Main hook for generating optimized BINGO PDFs
 * NO html2canvas - Pure jsPDF rendering
 */

import { useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { loadImagesAsBase64 } from 'modules/shared/utils/image-loader';
import { PDF_CONFIG } from 'modules/shared/constants/pdf-config';
import { renderBingoCard, renderPDFHeader } from '../domain/pdf-card-renderer';
import { organizeCardsIntoPages, getCardPositions } from '../domain/pdf-layout';

// Import watermark images
import logo1 from 'assets/images/marca_agua/logo-contrato.png';
import logo2 from 'assets/images/marca_agua/logo-empresa.png';

/**
 * Hook for generating BINGO PDFs
 * @returns {Object} PDF generation functions and state
 */
export function useBingoPDF() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Generate PDF from bingo cards
   * @param {Array} bingoCards - Array of bingo card objects
   * @param {Object} event - Event information
   * @param {Object} user - User information
   * @param {Function} onProgress - Progress callback (0-100)
   */
  const generatePDF = useCallback(async (bingoCards, event, user, onProgress = null) => {
    if (!bingoCards || bingoCards.length === 0) {
      throw new Error('No hay cartillas para generar el PDF');
    }

    setIsGenerating(true);
    setProgress(0);
    setError(null);

    try {
      // Step 1: Load watermark images (5% progress)
      setProgress(5);
      onProgress?.(5);

      const [logo1Base64, logo2Base64] = await loadImagesAsBase64([logo1, logo2]);

      // Step 2: Initialize PDF (10% progress)
      setProgress(10);
      onProgress?.(10);

      const pdf = new jsPDF({
        orientation: PDF_CONFIG.PAGE.ORIENTATION,
        unit: 'mm',
        format: 'a4'
      });

      // Step 3: Organize cards into pages
      const pages = organizeCardsIntoPages(bingoCards);
      const totalPages = pages.length;

      setProgress(15);
      onProgress?.(15);

      // Step 4: Render each page (15% -> 95% progress)
      for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
        // Add new page (except for first)
        if (pageIndex > 0) {
          pdf.addPage();
        }

        // Render header on each page
        renderPDFHeader(pdf, event, user);

        // Get cards for this page
        const cardsOnPage = pages[pageIndex];
        const positions = getCardPositions(cardsOnPage.length);

        // Render each card on the page
        cardsOnPage.forEach((card, cardIndex) => {
          const { x, y } = positions[cardIndex];
          renderBingoCard(pdf, card, x, y, logo1Base64, logo2Base64);
        });

        // Update progress (15% to 95% based on pages processed)
        const pageProgress = 15 + ((pageIndex + 1) / totalPages) * 80;
        setProgress(pageProgress);
        onProgress?.(pageProgress);
      }

      // Step 5: Save PDF (95% -> 100% progress)
      setProgress(95);
      onProgress?.(95);

      const fileName = `Cartillas_Bingo_${event?.name || 'Evento'}.pdf`;
      pdf.save(fileName);

      setProgress(100);
      onProgress?.(100);

      setIsGenerating(false);

      return {
        success: true,
        fileName,
        totalCards: bingoCards.length,
        totalPages
      };
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError(err.message || 'Error al generar el PDF');
      setIsGenerating(false);
      setProgress(0);

      throw err;
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setIsGenerating(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    generatePDF,
    isGenerating,
    progress,
    error,
    reset
  };
}

export default useBingoPDF;
