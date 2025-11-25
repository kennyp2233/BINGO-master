/**
 * BingoPDFButton Component
 * Optimized PDF generation button with progress feedback
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, CircularProgress, Box, Typography, LinearProgress } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useBingoPDF } from '../hooks/useBingoPDF';

export const BingoPDFButton = ({ bingoCards, event, user, variant = 'contained', color = 'primary', style = {} }) => {
  const { generatePDF, isGenerating, progress, error } = useBingoPDF();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGeneratePDF = async () => {
    try {
      setShowSuccess(false);
      const result = await generatePDF(bingoCards, event, user);

      // Show success message briefly
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      console.log('PDF generated successfully:', result);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    }
  };

  // Disabled state
  const isDisabled = isGenerating || !bingoCards || bingoCards.length === 0;

  // Button content based on state
  const getButtonContent = () => {
    if (showSuccess) {
      return (
        <>
          <CheckCircleIcon sx={{ mr: 1 }} />
          PDF Generado
        </>
      );
    }

    if (error) {
      return (
        <>
          <ErrorIcon sx={{ mr: 1 }} />
          Error al Generar
        </>
      );
    }

    if (isGenerating) {
      return (
        <>
          <CircularProgress size={20} sx={{ mr: 1, color: '#FFF' }} />
          Generando {Math.round(progress)}%
        </>
      );
    }

    return (
      <>
        <PictureAsPdfIcon sx={{ mr: 1 }} />
        Descargar PDF
      </>
    );
  };

  // Button color based on state
  const getButtonColor = () => {
    if (showSuccess) return 'success';
    if (error) return 'error';
    return color;
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Button
        variant={variant}
        color={getButtonColor()}
        onClick={handleGeneratePDF}
        disabled={isDisabled}
        style={{
          color: '#FFF',
          minWidth: 180,
          ...style
        }}
      >
        {getButtonContent()}
      </Button>

      {/* Progress bar below button when generating */}
      {isGenerating && (
        <Box sx={{ width: '100%', mt: 1 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>
            {Math.round(progress)}% - Generando PDF...
          </Typography>
        </Box>
      )}

      {/* Error message */}
      {error && !isGenerating && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
          {error}
        </Typography>
      )}

      {/* Card count info */}
      {!isGenerating && !error && bingoCards && bingoCards.length > 0 && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#666' }}>
          {bingoCards.length} cartilla{bingoCards.length !== 1 ? 's' : ''}
        </Typography>
      )}
    </Box>
  );
};

BingoPDFButton.propTypes = {
  bingoCards: PropTypes.array.isRequired,
  event: PropTypes.object,
  user: PropTypes.object,
  variant: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object
};

export default BingoPDFButton;
