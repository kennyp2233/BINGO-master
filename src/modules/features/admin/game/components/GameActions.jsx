import { Box, Button, ButtonGroup, Grid } from '@mui/material';
import { gameTexts } from '../constants/gameTexts';
import { IconDeviceFloppy, IconFlag3, IconPlayerPlay } from '@tabler/icons';
import { gameStyles } from '../styles/gameStyles';
import { toast } from 'react-toastify';
import { generateId } from 'modules/shared/utils/idGenerator';
import { fullDate } from 'modules/shared/utils/validations';
import { createDocument } from 'modules/shared/services/firebaseCommon';
import { collBoards } from 'store/collections';

export const GameActions = (props) => {
  const { resultBingo, setShowConfirmFinish, winners, setShowWinner, setOpenLoader, bingoNumbers, selectedGame } = props;

  const handleFinishGame = () => {
    setShowConfirmFinish(true);
  };

  const handleShowWinner = () => {
    setShowWinner(true);
  };

  const handleSaveBoard = () => {
    if (!winners || winners.length === 0) {
      toast.error('Es necesario que haya un ganador para guardar el tablero');
      return;
    }
    setOpenLoader(true);
    const ide = generateId(10);
    
    // Map winners to a cleaner structure
    const winnersList = winners.map(w => ({
        userId: w.userId,
        userName: w.userName,
        num: w.num,
        bingoNumbers: w.bingoNumbers,
        cardId: w.idCard || w.id
    }));

    const object = {
      id: ide,
      createAt: fullDate(),
      result: resultBingo,
      drawnNumbers: bingoNumbers,
      eventId: selectedGame,
      winners: winnersList,
      // Legacy support: keep 'winner' field with the first winner
      winner: winnersList[0]
    };

    try {
      createDocument(collBoards, ide, object);
      toast.success(gameTexts.successSave);
      setOpenLoader(false);

      // Clear localStorage when the game is saved
      localStorage.removeItem('bingoNumbers');
      localStorage.removeItem('resultBingo');
    } catch (error) {
      toast.error(gameTexts.errorSave);
      setOpenLoader(false);
    }
    // window.location.reload();
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const hasWinners = winners && winners.length > 0;

  return (
    <Grid container style={{ marginTop: 10 }}>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box sx={{ background: '#FFF', p: 1, borderRadius: 5, pl: 2, pr: 2 }}>
              <h3>{gameTexts.backTitle}:</h3>
              <h4>{resultBingo}</h4>
            </Box>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box sx={{ background: '#179cdc', p: 2, borderRadius: 5, pl: 3, pr: 3 }}>
              <center>
                {hasWinners && <h3 style={{ color: '#FFF' }}>{gameTexts.endBoard}</h3>}
                <ButtonGroup aria-label="Basic button group">
                  <Button variant="outlined" style={gameStyles.endBtn} onClick={handleSaveBoard} startIcon={<IconDeviceFloppy />}>
                    {gameTexts.saveBoard}
                  </Button>
                  <Button variant="outlined" style={gameStyles.endBtn} onClick={handleFinishGame} startIcon={<IconFlag3 />}>
                    {gameTexts.labelFinish}
                  </Button>
                  {hasWinners && (
                    <Button variant="outlined" style={gameStyles.endBtn} onClick={handleShowWinner} startIcon={<IconPlayerPlay />}>
                      {gameTexts.labelShowWinner}
                    </Button>
                  )}
                </ButtonGroup>
              </center>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
