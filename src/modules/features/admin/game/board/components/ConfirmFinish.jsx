import PropTypes from 'prop-types';
import { Box, Button, ButtonGroup, Modal, Typography } from '@mui/material';

export const ConfirmFinish = ({ showConfirmFinish, setShowConfirmFinish }) => {
  const confirmFinishGame = () => {
    // Clear all game progress data from localStorage
    localStorage.removeItem('selectedGame');
    localStorage.removeItem('bingoNumbers');
    localStorage.removeItem('resultBingo');
    window.location.reload();
  };

  return (
    <Modal open={showConfirmFinish} onClose={() => setShowConfirmFinish(false)}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '70%', md: '50%' },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h3" sx={{ mb: 3 }}>
          ¿Está seguro que desea finalizar la partida?
          <Typography variant="h4" color="error" sx={{ mt: 1 }}>
            Los cambios no guardados se perderán
          </Typography>
        </Typography>
        <ButtonGroup>
          <Button variant="contained" color="primary" onClick={confirmFinishGame} sx={{ mr: 1 }}>
            Confirmar
          </Button>
          <Button variant="outlined" onClick={() => setShowConfirmFinish(false)}>
            Cancelar
          </Button>
        </ButtonGroup>
      </Box>
    </Modal>
  );
};

ConfirmFinish.propTypes = {
  showConfirmFinish: PropTypes.bool,
  setShowConfirmFinish: PropTypes.func
};
