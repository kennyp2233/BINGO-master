import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { termsService } from '../services/termsService';

const TermsModal = ({ open, onClose, onAccept }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [termsData, setTermsData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadTerms();
    }
  }, [open]);

  const loadTerms = async () => {
    try {
      setLoading(true);
      const terms = await termsService.getTermsAndConditions();
      setTermsData(terms);
    } catch (error) {
      console.error('Error cargando términos:', error);
      // Fallback a términos estáticos si falla la carga
      setTermsData({
        title: 'Términos y Condiciones',
        content: 'Error al cargar los términos. Por favor, contacte al soporte.',
        version: '1.0'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    onAccept();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          minHeight: fullScreen ? '100vh' : '70vh',
          maxHeight: fullScreen ? '100vh' : '90vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          py: 2
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {termsData?.title || 'Términos y Condiciones'}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          padding: { xs: 2, sm: 3 },
          backgroundColor: '#f8f9fa'
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            padding: { xs: 2, sm: 3 },
            borderRadius: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minHeight: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-line',
                lineHeight: 1.6,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                textAlign: 'justify'
              }}
            >
              {termsData?.content || 'Cargando términos y condiciones...'}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          padding: { xs: 2, sm: 3 },
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #dee2e6'
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            minWidth: { xs: 100, sm: 120 },
            mr: 1
          }}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleAccept}
          variant="contained"
          color="primary"
          sx={{
            minWidth: { xs: 100, sm: 120 },
            fontWeight: 'bold'
          }}
          disabled={loading}
        >
          Acepto
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsModal;