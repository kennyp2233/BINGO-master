import { useState } from 'react';
import { Button, Modal, Box, TextField, CircularProgress, Grid, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip } from '@mui/material';
import { IconArrowBackUp } from '@tabler/icons';
import { toast } from 'react-toastify';
import { titles } from '../card.texts';
import { uiStyles } from '../card.styles';
import { returnCard, returnCardByOrder } from '../services/cardsService';

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
        // Devolver por número de cartilla
        const cardOrder = parseInt(cardValue);
        if (isNaN(cardOrder)) {
          throw new Error('El número de cartilla debe ser un número válido.');
        }
        await returnCardByOrder(eventId, cardOrder);
        toast.success(`Cartilla número ${cardOrder} devuelta con éxito.`);
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
            label={searchType === 'order' ? 'Número de Cartilla' : 'ID de la Cartilla'}
            variant="outlined"
            value={cardValue}
            onChange={(e) => setCardValue(e.target.value)}
            sx={{ mt: 2 }}
            inputProps={{
              inputMode: searchType === 'order' ? 'numeric' : 'text',
              pattern: searchType === 'order' ? '[0-9]*' : undefined
            }}
            helperText={
              searchType === 'order'
                ? 'Ingrese el número que aparece en la cartilla impresa (ej: 1, 2, 15, etc.)'
                : 'Ingrese el ID único completo de la cartilla'
            }
          />

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