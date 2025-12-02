import { Box, Button, FormControl, InputLabel, MenuItem, Select, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { gameStyles } from '../styles/gameStyles';
import { useEffect } from 'react';
import { getGamesList } from 'modules/features/admin/events';
import { IconPlayerPlay } from '@tabler/icons';

export const EventSelector = ({ selectedGame, setSelectedGame, setShowGameBoard, games, setGames, quinaRules, setQuinaRules }) => {
  useEffect(() => {
    getGamesList().then((data) => {
      setGames(data);
    });

    const savedGame = localStorage.getItem('selectedGame');
    if (savedGame) {
      setSelectedGame(savedGame);
      // Don't auto-start, let user review rules
      // setShowGameBoard(true); 
    }
  }, []);

  const handleGameSelect = (event) => {
    // console.log({ event });
    setSelectedGame(event.target.value);
  };

  const handleRuleChange = (event) => {
    setQuinaRules({
      ...quinaRules,
      [event.target.name]: event.target.checked,
    });
  };

  const handleContinue = () => {
    if (selectedGame) {
      localStorage.setItem('selectedGame', selectedGame);
      setShowGameBoard(true);
    }
  };

  return (
    <Box sx={gameStyles.box}>
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

        <Box sx={{ maxWidth: 400, m: 2, textAlign: 'left', border: '1px solid #ddd', p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Reglas para Quina (con FREE):
          </Typography>
          <FormGroup>
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
        </Box>

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
