import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grid, Modal, Typography, CircularProgress, Paper } from '@mui/material';
import { IconCircleX, IconEye } from '@tabler/icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from 'config/firebase';
import { uiStyles } from '../../board/board.styles';
import { titles } from '../../board/board.texts';
import { genConst } from 'store/constant';

// Bingo card display component for modal
const BingoCardDisplay = ({ bingoNumbers }) => {
  if (!bingoNumbers || !Array.isArray(bingoNumbers) || bingoNumbers.length !== 25) {
    return <Typography color="text.secondary">No hay datos de cartilla disponibles o formato incorrecto</Typography>;
  }

  const createCard = () => {
    // Split the array into 5 columns
    const bColumn = bingoNumbers.slice(0, 5);
    const iColumn = bingoNumbers.slice(5, 10);
    const nColumn = bingoNumbers.slice(10, 15);
    const gColumn = bingoNumbers.slice(15, 20);
    const oColumn = bingoNumbers.slice(20, 25);

    return [
      { letter: 'B', numbers: bColumn },
      { letter: 'I', numbers: iColumn },
      { letter: 'N', numbers: nColumn },
      { letter: 'G', numbers: gColumn },
      { letter: 'O', numbers: oColumn }
    ];
  };

  const columns = createCard();

  // Cell size for card display
  const cellSize = 45;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* BINGO header row */}
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', mb: 1 }}>
        {columns.map((column, colIndex) => (
          <Box
            key={`header-${colIndex}`}
            sx={{
              width: cellSize,
              height: cellSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1976d2',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              m: 0.5,
              borderRadius: '4px'
            }}
          >
            {column.letter}
          </Box>
        ))}
      </Box>

      {/* Bingo numbers grid */}
      <Box sx={{ display: 'flex' }}>
        {columns.map((column, colIndex) => (
          <Box key={`col-${colIndex}`} sx={{ display: 'flex', flexDirection: 'column' }}>
            {column.numbers.map((number, rowIndex) => (
              <Box
                key={`cell-${colIndex}-${rowIndex}`}
                sx={{
                  width: cellSize,
                  height: cellSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #ccc',
                  m: 0.5,
                  backgroundColor: number === 'FREE' ? '#1976d2' : 'white',
                  color: number === 'FREE' ? 'white' : 'inherit',
                  fontWeight: number === 'FREE' ? 'bold' : 'normal',
                  borderRadius: '4px',
                  fontSize: number === 'FREE' ? '0.8rem' : '1rem'
                }}
              >
                {number}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Card Modal Component
const CardModal = ({ open, handleClose, bingoNumbers, cardNumber }) => {
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="card-modal-title">
      <Box
        sx={{
          ...uiStyles.modalStylesDelete,
          width: '400px',
          maxWidth: '90%',
          p: 3
        }}
      >
        <Typography id="card-modal-title" variant="h4" component="h2" align="center" gutterBottom>
          Cartilla: {cardNumber || 'N/A'}
        </Typography>

        <Box sx={{ my: 3 }}>
          <BingoCardDisplay bingoNumbers={bingoNumbers} />
        </Box>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<IconCircleX />}
            size="large"
            style={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF' }}
            onClick={handleClose}
          >
            {titles.buttonClose}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

CardModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  bingoNumbers: PropTypes.array,
  cardNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

BingoCardDisplay.propTypes = {
  bingoNumbers: PropTypes.array
};

export const ShowAllWinners = ({ open, handleClose, eventId }) => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardModalOpen, setCardModalOpen] = useState(false);

  const openCardModal = (winnerData) => {
    setSelectedCard(winnerData);
    setCardModalOpen(true);
  };

  const closeCardModal = () => {
    setCardModalOpen(false);
  };

  useEffect(() => {
    const fetchWinners = async () => {
      if (!open || !eventId) return;

      setLoading(true);
      try {
        const boardsRef = collection(db, 'Boards');
        const q = query(boardsRef, where('eventId', '==', eventId));
        const querySnapshot = await getDocs(q);

        const userCardsRef = collection(db, 'UserCards');
        const userCardsQuery = query(userCardsRef, where('eventId', '==', eventId));
        const userCardsSnapshot = await getDocs(userCardsQuery);
        console.log('userCardsSnapshot total', userCardsSnapshot.docs.length);

        const winnersData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.winner) {
            winnersData.push(data);
          }
        });

        setWinners(winnersData);
      } catch (error) {
        console.error('Error fetching winners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, [open, eventId]);

  return (
    <>
      <Modal open={open} onClose={handleClose} aria-labelledby="winners-modal-title" aria-describedby="winners-modal-description">
        <Box
          sx={{
            ...uiStyles.modalStylesDelete,
            width: '98%', // Even wider modal (98% of viewport)
            maxWidth: 1800, // Increased max width
            height: '92vh', // Slightly taller
            maxHeight: '92vh',
            overflow: 'auto',
            p: 3
          }}
        >
          <Typography id="winners-modal-title" variant="h2" component="h1" align="center" gutterBottom sx={{ mb: 3 }}>
            Ganadores del evento
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress color="primary" size={60} />
            </Box>
          ) : winners.length === 0 ? (
            <Typography variant="h5" align="center" sx={{ my: 5, color: 'text.secondary' }}>
              No se encontraron ganadores para este evento
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {winners.map((winner, index) => (
                <Grid item key={winner.id || index}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: '#f9f9f9',
                      height: '100%',
                      width: '100%', // Ensure full width within the grid item
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <Typography
                      variant="h5"
                      gutterBottom
                      color="primary"
                      sx={{
                        fontWeight: 'bold',
                        borderBottom: '2px solid #eee',
                        pb: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {winner.winner.userName || 'Usuario desconocido'}
                    </Typography>

                    <Box sx={{ flex: 1, width: '100%' }}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            ID cartilla:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body1">{winner.winner.num || 'No disponible'}</Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            Usuario:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="body1"
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {winner.winner.userName || 'No disponible'}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                        Números jugados:
                      </Typography>

                      <Box
                        sx={{
                          p: 1.5,
                          height: '100px', // Taller box for more content
                          overflow: 'auto',
                          backgroundColor: '#f0f0f0',
                          borderRadius: 1,
                          fontSize: '0.875rem',
                          wordBreak: 'break-word',
                          mb: 2,
                          width: '100%'
                        }}
                      >
                        {winner.result || 'No disponible'}
                      </Box>
                    </Box>

                    <Button
                      variant="contained"
                      startIcon={<IconEye />}
                      fullWidth
                      size="large"
                      sx={{
                        mt: 'auto',
                        py: 1,
                        fontSize: '1rem',
                        backgroundColor: genConst.CONST_UPDATE_COLOR,
                        '&:hover': {
                          backgroundColor: '#0277bd'
                        }
                      }}
                      onClick={() => openCardModal(winner.winner)}
                      disabled={!winner.winner.bingoNumbers}
                    >
                      Ver Cartilla
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<IconCircleX />}
              size="large"
              style={{
                backgroundColor: genConst.CONST_CREATE_COLOR,
                color: '#FFF',
                padding: '10px 30px',
                fontSize: '1.1rem'
              }}
              onClick={handleClose}
            >
              {titles.buttonClose}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Card Modal */}
      {selectedCard && (
        <CardModal
          open={cardModalOpen}
          handleClose={closeCardModal}
          bingoNumbers={selectedCard.bingoNumbers}
          cardNumber={selectedCard.num}
        />
      )}
    </>
  );
};

ShowAllWinners.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  eventId: PropTypes.string
};
