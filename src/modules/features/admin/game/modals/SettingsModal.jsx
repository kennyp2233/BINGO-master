import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Box, Typography, FormGroup, FormControlLabel, Checkbox, Button } from '@mui/material';
import { IconSettings } from '@tabler/icons';
import { gameStyles } from '../styles/gameStyles';

export const SettingsModal = ({ open, handleClose, quinaRules, setQuinaRules }) => {
  const handleRuleChange = (event) => {
    setQuinaRules({
      ...quinaRules,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="settings-modal-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconSettings size={28} style={{ marginRight: 10 }} />
          <Typography id="settings-modal-title" variant="h5" component="h2">
            Configuración del Juego
          </Typography>
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
          Reglas para Quina (con FREE):
        </Typography>
        
        <FormGroup sx={{ ml: 2 }}>
          <FormControlLabel
            control={
              <Checkbox checked={quinaRules.CENTER_ROW} onChange={handleRuleChange} name="CENTER_ROW" />
            }
            label="Fila Central"
          />
          <FormControlLabel
            control={
              <Checkbox checked={quinaRules.CENTER_COL} onChange={handleRuleChange} name="CENTER_COL" />
            }
            label="Columna Central"
          />
          <FormControlLabel
            control={
              <Checkbox checked={quinaRules.DIAGONALS} onChange={handleRuleChange} name="DIAGONALS" />
            }
            label="Diagonales"
          />
        </FormGroup>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleClose}>
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

SettingsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  quinaRules: PropTypes.object.isRequired,
  setQuinaRules: PropTypes.func.isRequired,
};
