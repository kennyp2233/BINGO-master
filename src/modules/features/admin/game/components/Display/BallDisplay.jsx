import React, { useState } from 'react';
import { Grid, Box, ToggleButton, ToggleButtonGroup, Typography, Paper } from '@mui/material';
import { IconDeviceTv, IconBallBowling } from '@tabler/icons';
import { gameStyles } from '../../styles/gameStyles';
import { gameTexts } from '../../constants/gameTexts';
import { BingoCage } from './BingoCage';
import { BingoBall } from './BingoBall';

export const BallDisplay = ({ number, letter, prevNumber, prevLetter }) => {
  const [viewMode, setViewMode] = useState('3d'); // 'classic' or '3d'

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      {/* View Selector */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="view mode"
          size="small"
        >
          <ToggleButton value="classic" aria-label="classic view">
            <IconDeviceTv size={20} style={{ marginRight: 5 }} />
            Clásica
          </ToggleButton>
          <ToggleButton value="3d" aria-label="3d view">
            <IconBallBowling size={20} style={{ marginRight: 5 }} />
            Animada
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === '3d' ? (
        <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: '#f5f5f5' }}>
          <BingoCage 
            currentNumber={number} 
            currentLetter={letter} 
            prevNumber={prevNumber} 
            prevLetter={prevLetter} 
          />
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {/* Classic View (Enhanced with BingoBall component but keeping layout) */}
          <Grid item xs={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                bgcolor: '#e3f2fd',
                borderRadius: 2,
                height: '100%'
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                {gameTexts.actual}
              </Typography>
              <BingoBall 
                number={number} 
                letter={letter} 
                size={140} 
                isNew={true}
                key={`classic-curr-${number}`}
              />
            </Paper>
          </Grid>
          
          <Grid item xs={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                bgcolor: '#f5f5f5',
                borderRadius: 2,
                height: '100%'
              }}
            >
              <Typography variant="h6" color="textSecondary" gutterBottom fontWeight="bold">
                {gameTexts.ante}
              </Typography>
              {prevNumber ? (
                <BingoBall 
                  number={prevNumber} 
                  letter={prevLetter} 
                  size={100} 
                  key={`classic-prev-${prevNumber}`}
                />
              ) : (
                <Box sx={{ width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="textSecondary">-</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
