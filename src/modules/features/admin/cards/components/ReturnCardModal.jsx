import { useState } from 'react';
import { Button, Modal, Box, TextField, CircularProgress, Grid, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip } from '@mui/material';
import { IconArrowBackUp } from '@tabler/icons';
import { toast } from 'react-toastify';
import { titles } from '../card.texts';
import { uiStyles } from '../card.styles';
import { returnCard, returnCardByOrder, returnCardsByOrderBatch } from '../services/cardsService';

const ReturnCardModal = ({ eventId, onCardReturned }) => {
  const [open, setOpen] = useState(false);
  const [searchType, setSearchType] = useState('order'); // 'order' o 'id'
  const [cardValue, setCardValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCardValue('');
    setSearchType('order');
  };

  const handleReturnCard = async () => {
    if (!cardValue) {
      toast.error(`Por favor, ingrese el ${searchType === 'order' ? 'número de cartilla' : 'ID de la cartilla'}.`);
      return;
    }

    setLoading(true);
    try {
      if (searchType === 'order') {
        // Parsear entrada para soportar rangos y listas (ej: "1-5, 8, 10")
        const parts = cardValue.split(',').map(p => p.trim()).filter(p => p);
        const ordersToReturn = [];

        for (const part of parts) {
          if (part.includes('-')) {
            const [start, end] = part.split('-').map(n => parseInt(n));
            if (!isNaN(start) && !isNaN(end) && start <= end) {
              for (let i = start; i <= end; i++) {
                ordersToReturn.push(i);
              }
            } else {
              throw new Error(`Rango inválido: ${part}`);
            }
          } else {
            const num = parseInt(part);
            if (!isNaN(num)) {
              ordersToReturn.push(num);
            } else {
              throw new Error(`Número inválido: ${part}`);
            }
          }
        }

        if (ordersToReturn.length === 0) {
          throw new Error('No se encontraron números válidos.');
        }

        if (ordersToReturn.length === 1) {
          await returnCardByOrder(eventId, ordersToReturn[0]);
          toast.success(`Cartilla número ${ordersToReturn[0]} devuelta con éxito.`);
        } else {
          const result = await returnCardsByOrderBatch(eventId, ordersToReturn);
          toast.success(`Se devolvieron ${result.success} cartillas de ${result.totalRequested}.`);
        }

      } else {
        // Devolver por ID único
        await returnCard(eventId, cardValue);
        toast.success('Cartilla devuelta con éxito.');
      }

      onCardReturned();
      handleClose();
    } catch (error) {
      console.error('Error returning card:', error);
      toast.error(error.message || 'Error al devolver la cartilla.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Devolver Cartilla">
        <IconButton color="inherit" onClick={handleOpen}>
          <IconArrowBackUp color="#FFF" />
        </IconButton>
      </Tooltip>
      <Modal open={open} onClose={handleClose}>
        <Box sx={uiStyles.modalStyles}>
          <h2 id="return-card-modal-title">Devolver Cartilla de Bingo</h2>
          <p id="return-card-modal-description">
            Seleccione cómo identificar la cartilla y complete el campo correspondiente.
          </p>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="search-type-label">Buscar por</InputLabel>
            <Select
              labelId="search-type-label"
              id="search-type"
              value={searchType}
              label="Buscar por"
              onChange={(e) => setSearchType(e.target.value)}
            >
              <MenuItem value="order">Número de Cartilla (recomendado)</MenuItem>
              <MenuItem value="id">ID Único de Cartilla</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label={searchType === 'order' ? 'Número de Cartilla (o rango ej: 1-10)' : 'ID de la Cartilla'}
            variant="outlined"
            value={cardValue}
            onChange={(e) => setCardValue(e.target.value)}
            sx={{ mt: 2 }}
            inputProps={{
              inputMode: 'text'
            }}
            helperText={
              searchType === 'order'
                ? 'Ingrese números (ej: 1, 5) o rangos (ej: 10-20). Separe con comas.'
                : 'Ingrese el ID único completo de la cartilla'
            }
          />

          <Box sx={{ mt: 2, p: 2, bgcolor: '#fff4e5', borderRadius: 1, border: '1px solid #ffcc80' }}>
            <p style={{ margin: 0, color: '#663c00', fontSize: '0.875rem' }}>
              <strong>¡Atención!</strong> Esta acción es irreversible. Si devuelve la cartilla, el jugador perderá el acceso a ella y no podrá recuperarla.
            </p>
          </Box>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Button fullWidth onClick={handleClose}>
                Cancelar
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="contained" color="primary" onClick={handleReturnCard} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Devolver'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default ReturnCardModal;