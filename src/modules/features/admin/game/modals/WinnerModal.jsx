import { Box, Button, Modal, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export const WinnerModal = ({ showWinner, handleCloseWinner, winners = [], quinaWinners = [] }) => {
  const allWinners = [...(winners || []), ...(quinaWinners || [])];
  const isBingo = winners && winners.length > 0;
  const isQuina = quinaWinners && quinaWinners.length > 0;

  let title = "¡GANADOR!";
  if (isBingo && isQuina) title = "¡BINGO Y QUINA!";
  else if (isBingo) title = "¡BINGO!";
  else if (isQuina) title = "¡QUINA!";

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
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'popup 0.5s ease-out',
          '@keyframes popup': {
            '0%': { transform: 'translate(-50%, -50%) scale(0.7)', opacity: 0 },
            '100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }
          }
        }}
      >
        <Typography variant="h3" component="h2" sx={{ color: '#04acec', mb: 2, fontWeight: 'bold' }}>
          {title}
        </Typography>
        
        <Typography variant="h4" sx={{ mb: 2 }}>
          {allWinners.length > 1 ? `¡Tenemos ${allWinners.length} Ganadores!` : '¡Tenemos un Ganador!'}
        </Typography>

        {allWinners.map((winner, index) => (
          <Box
            key={index}
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
              {winner?.winner?.userName || winner?.userName}
            </Typography>
            <Typography variant="h4" sx={{ color: '#fff', mt: 1 }}>
              Cartilla N°: {winner?.winner?.num || winner?.num}
            </Typography>
            {/* Show type of win if mixed */}
            {isBingo && isQuina && (
               <Typography variant="h6" sx={{ color: '#e1f5fe', mt: 1, fontStyle: 'italic' }}>
                 {winners.includes(winner) ? '(Bingo)' : '(Quina)'}
               </Typography>
            )}
          </Box>
        ))}

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

WinnerModal.propTypes = {
  showWinner: PropTypes.bool.isRequired,
  handleCloseWinner: PropTypes.func.isRequired,
  winners: PropTypes.array,
  quinaWinners: PropTypes.array
};
