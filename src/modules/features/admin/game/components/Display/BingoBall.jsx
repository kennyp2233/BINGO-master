import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const getBallColor = (letter) => {
  switch (letter?.toUpperCase()) {
    case 'B': return '#2196f3'; // Blue
    case 'I': return '#f44336'; // Red
    case 'N': return '#ffffff'; // White (needs dark text)
    case 'G': return '#4caf50'; // Green
    case 'O': return '#ff9800'; // Orange
    default: return '#e0e0e0';
  }
};

const getTextColor = (letter) => {
  return letter?.toUpperCase() === 'N' ? '#333' : '#fff';
};

export const BingoBall = ({ number, letter, size = 120, delay = 0, isNew = false }) => {
  const bgColor = getBallColor(letter);
  const textColor = getTextColor(letter);

  return (
    <motion.div
      initial={isNew ? { scale: 0, rotate: -180 } : {}}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay 
      }}
    >
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, ${bgColor}, #000)`,
          boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.5), 5px 5px 15px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          border: '4px solid rgba(255,255,255,0.1)',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '15%',
            left: '15%',
            width: '20%',
            height: '20%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.8), rgba(255,255,255,0))',
            filter: 'blur(2px)'
          }
        }}
      >
        <Box
          sx={{
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '50%',
            width: size * 0.6,
            height: size * 0.6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#333',
              fontWeight: 'bold',
              fontSize: size * 0.15,
              lineHeight: 1
            }}
          >
            {letter}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              color: '#000',
              fontWeight: '900',
              fontSize: size * 0.35,
              lineHeight: 1
            }}
          >
            {number}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};
