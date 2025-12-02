import { ButtonGroup, Button, Box, TextField, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { IconTrophy, IconSettings } from '@tabler/icons';
import { gameStyles } from '../../styles/gameStyles';
import { gameTexts } from '../../constants/gameTexts';
import { useState } from 'react';

export const GameControls = ({ onNext, onReset, onShowWinners, onManualAdd, onOpenSettings, cont, checkingWinner, hasWinner }) => {
  const [manualNumber, setManualNumber] = useState('');

  const handleManualAdd = () => {
    try {
      onManualAdd(manualNumber);
      setManualNumber('');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box>
      <center>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <ButtonGroup aria-label="Basic button group">
            <Button variant="contained" style={gameStyles.btnMain} onClick={onNext} disabled={hasWinner || checkingWinner}>
                {checkingWinner ? (
                <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Comprobando...
                </>
                ) : (
                gameTexts.next
                )}
            </Button>
            <Button variant="outlined" style={gameStyles.btnCount}>
                <h2>{cont}</h2>
            </Button>
            <Button variant="contained" style={gameStyles.btnMain} onClick={onReset} disabled={checkingWinner}>
                {gameTexts.restart}
            </Button>
            <Button
                variant="contained"
                style={{ ...gameStyles.btnMain, backgroundColor: '#f5b942' }}
                onClick={onShowWinners}
                startIcon={<IconTrophy />}
            >
                Ver Ganadores
            </Button>
            </ButtonGroup>
            
            <Tooltip title="Configuración">
                <IconButton 
                    onClick={onOpenSettings} 
                    sx={{ 
                        bgcolor: '#e0e0e0', 
                        '&:hover': { bgcolor: '#d5d5d5' },
                        width: 48,
                        height: 48
                    }}
                >
                    <IconSettings />
                </IconButton>
            </Tooltip>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
          <TextField
            label="Ingreso Manual"
            variant="outlined"
            size="small"
            type="number"
            value={manualNumber}
            onChange={(e) => setManualNumber(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleManualAdd();
              }
            }}
            sx={{ width: 150, bgcolor: 'white', borderRadius: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleManualAdd}
            disabled={!manualNumber || checkingWinner}
          >
            Agregar
          </Button>
        </Box>
      </center>
    </Box>
  );
};
