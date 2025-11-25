import { Box, Button, Modal, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export const ShowWinner = ({ showWinner, handleCloseWinner, winner }) => {
  return (
    <Modal open={showWinner} onClose={handleCloseWinner} aria-labelledby="winner-modal" aria-describedby="winner-announcement">
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
          textAlign: 'center',
          animation: 'popup 0.5s ease-out',
          '@keyframes popup': {
            '0%': { transform: 'translate(-50%, -50%) scale(0.7)', opacity: 0 },
            '100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }
          }
        }}
      >
        <Typography variant="h3" component="h2" sx={{ color: '#04acec', mb: 2, fontWeight: 'bold' }}>
          ¡BINGO!
        </Typography>
        <Box
          sx={{
            backgroundColor: '#179cdc',
            p: 3,
            borderRadius: 2,
            mb: 3
          }}
        >
          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold' }}>
            ¡Felicitaciones!
          </Typography>
          <Typography variant="h4" sx={{ color: '#fff', mt: 1 }}>
            {winner?.userName}
          </Typography>
          <Typography variant="h4" sx={{ color: '#fff', mt: 1 }}>
            Cartilla N°: 0000{winner?.num}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleCloseWinner}
          sx={{
            backgroundColor: '#04acec',
            '&:hover': { backgroundColor: '#038ac0' }
          }}
        >
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};

ShowWinner.propTypes = {
  showWinner: PropTypes.bool.isRequired,
  handleCloseWinner: PropTypes.func.isRequired,
  winner: PropTypes.object
};
