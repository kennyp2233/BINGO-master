import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { uiStyles } from '../../board/board.styles';
import { useEffect } from 'react';
import { getGamesList } from 'modules/features/admin/events';
import { IconPlayerPlay } from '@tabler/icons';

export const SelectEventGame = ({ selectedGame, setSelectedGame, setShowGameBoard, games, setGames }) => {
  useEffect(() => {
    getGamesList().then((data) => {
      setGames(data);
    });

    const savedGame = localStorage.getItem('selectedGame');
    if (savedGame) {
      setSelectedGame(savedGame);
      setShowGameBoard(true);
    }
  }, []);

  const handleGameSelect = (event) => {
    // console.log({ event });
    setSelectedGame(event.target.value);
  };

  const handleContinue = () => {
    if (selectedGame) {
      localStorage.setItem('selectedGame', selectedGame);
      setShowGameBoard(true);
    }
  };

  return (
    <Box sx={uiStyles.box}>
      <center>
        <FormControl fullWidth sx={{ maxWidth: 400, m: 2 }}>
          <InputLabel>Seleccciona un evento</InputLabel>
          <Select
            value={selectedGame}
            // onChange={(ev) => console.log({ ev })}
            onChange={handleGameSelect}
            label="Select Game"
          >
            {games.map((game) => (
              <MenuItem key={game.ide} value={game.ide}>
                {game.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          style={{ color: '#FFF' }}
          startIcon={<IconPlayerPlay />}
          onClick={handleContinue}
          disabled={!selectedGame}
          sx={{ m: 2 }}
        >
          Continuar
        </Button>
      </center>
    </Box>
  );
};
