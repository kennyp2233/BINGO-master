import { Box, Button, ButtonGroup, Grid } from '@mui/material';
import { titles } from '../../board/board.texts';
import { IconDeviceFloppy, IconFlag3, IconPlayerPlay } from '@tabler/icons';
import { uiStyles } from '../../board/board.styles';
import { toast } from 'react-toastify';
import { generateId } from 'utils/idGenerator';
import { fullDate } from 'utils/validations';
import { createDocument } from 'modules/shared/services/firebaseCommon';
import { collBoards } from 'store/collections';

export const BoardActions = (props) => {
  const { resultBingo, setShowConfirmFinish, winner, setShowWinner, setOpenLoader, bingoNumbers, selectedGame } = props;

  const handleFinishGame = () => {
    setShowConfirmFinish(true);
  };

  const handleShowWinner = () => {
    setShowWinner(true);
  };

  const handleSaveBoard = () => {
    if (winner === null) {
      toast.error('Es necesario que haya un ganador para guardar el tablero');
      return;
    }
    setOpenLoader(true);
    const ide = generateId(10);
    const object = {
      id: ide,
      createAt: fullDate(),
      result: resultBingo,
      drawnNumbers: bingoNumbers,
      eventId: selectedGame,
      winner: {
        userId: winner?.userId,
        userName: winner?.userName,
        num: winner?.num,
        bingoNumbers: winner?.bingoNumbers,
        cardId: winner?.idCard
      }
    };
    // console.log({ object });
    // return;
    try {
      createDocument(collBoards, ide, object);
      toast.success(titles.successSave);
      setOpenLoader(false);

      // Clear localStorage when the game is saved
      localStorage.removeItem('bingoNumbers');
      localStorage.removeItem('resultBingo');
    } catch (error) {
      toast.error(titles.errorSave);
      setOpenLoader(false);
    }
    // window.location.reload();
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  return (
    <Grid container style={{ marginTop: 10 }}>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box sx={{ background: '#FFF', p: 1, borderRadius: 5, pl: 2, pr: 2 }}>
              <h3>{titles.backTitle}:</h3>
              <h4>{resultBingo}</h4>
            </Box>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box sx={{ background: '#179cdc', p: 2, borderRadius: 5, pl: 3, pr: 3 }}>
              <center>
                {winner && <h3 style={{ color: '#FFF' }}>{titles.endBoard}</h3>}
                <ButtonGroup aria-label="Basic button group">
                  <Button variant="outlined" style={uiStyles.endBtn} onClick={handleSaveBoard} startIcon={<IconDeviceFloppy />}>
                    {titles.saveBoard}
                  </Button>
                  <Button variant="outlined" style={uiStyles.endBtn} onClick={handleFinishGame} startIcon={<IconFlag3 />}>
                    {titles.labelFinish}
                  </Button>
                  {winner && (
                    <Button variant="outlined" style={uiStyles.endBtn} onClick={handleShowWinner} startIcon={<IconPlayerPlay />}>
                      {titles.labelShowWinner}
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
