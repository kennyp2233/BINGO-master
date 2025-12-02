import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { BingoBall } from './BingoBall';
import { motion, AnimatePresence } from 'framer-motion';

export const BingoCage = ({ currentNumber, currentLetter, prevNumber, prevLetter }) => {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(true);
  const [internalNumber, setInternalNumber] = useState(currentNumber);
  const [internalLetter, setInternalLetter] = useState(currentLetter);

  // Detect change in number to trigger animation
  useEffect(() => {
    if (currentNumber && currentNumber !== internalNumber) {
      // Start sequence
      setShowResult(false);
      setIsSpinning(true);
      
      // Update internal state after animation starts
      setTimeout(() => {
        setInternalNumber(currentNumber);
        setInternalLetter(currentLetter);
      }, 500);

      // Stop spinning and show result
      setTimeout(() => {
        setIsSpinning(false);
        setShowResult(true);
      }, 2000); // 2 seconds spin
    } else if (!currentNumber) {
        // Reset if game reset
        setInternalNumber(null);
        setInternalLetter(null);
        setShowResult(false);
    }
  }, [currentNumber, currentLetter]);

  // Canvas Animation Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let rotation = 0;
    
    // Balls inside cage
    const balls = Array.from({ length: 20 }).map(() => ({
      r: Math.random() * 40 + 20, // radius from center
      theta: Math.random() * Math.PI * 2, // angle
      color: ['#2196f3', '#f44336', '#ffffff', '#4caf50', '#ff9800'][Math.floor(Math.random() * 5)],
      size: 8
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = 120;

      // Update rotation
      if (isSpinning) {
        rotation += 0.2; // Fast spin
        // Jiggle balls
        balls.forEach(ball => {
            ball.theta += 0.2;
            ball.r = Math.min(radius - 15, Math.max(20, ball.r + (Math.random() - 0.5) * 5));
        });
      } else {
        rotation += 0.005; // Idle slow spin
         // Balls settle to bottom
         balls.forEach(ball => {
             // Simple gravity simulation to bottom of circle (PI/2)
             // let targetTheta = Math.PI / 2 + (Math.random() - 0.5);
             ball.theta += 0.005;
         });
      }

      // Draw Cage (Back)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#555';
      ctx.stroke();
      
      // Spokes
      for(let i=0; i<8; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(radius * Math.cos(i * Math.PI / 4), radius * Math.sin(i * Math.PI / 4));
          ctx.strokeStyle = 'rgba(85, 85, 85, 0.5)';
          ctx.lineWidth = 2;
          ctx.stroke();
      }
      ctx.restore();

      // Draw Balls
      balls.forEach(ball => {
        const x = cx + ball.r * Math.cos(ball.theta + (isSpinning ? 0 : rotation)); // If spinning, theta updates. If idle, rotate with cage.
        const y = cy + ball.r * Math.sin(ball.theta + (isSpinning ? 0 : rotation));
        
        ctx.beginPath();
        ctx.arc(x, y, ball.size, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.stroke();
      });

      // Draw Cage (Front/Highlight) to give depth
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.arc(0, 0, radius - 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Stand
      ctx.beginPath();
      ctx.moveTo(cx - radius - 10, cy);
      ctx.lineTo(cx - radius - 20, cy + radius + 40);
      ctx.lineTo(cx + radius + 20, cy + radius + 40);
      ctx.lineTo(cx + radius + 10, cy);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 5;
      ctx.stroke();

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [isSpinning]);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      {/* Background Canvas Animation */}
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400} 
        style={{ 
          position: 'absolute', 
          zIndex: 0,
          opacity: 0.8
        }} 
      />

      {/* Main Ball Display */}
      <Box sx={{ zIndex: 1, display: 'flex', gap: 4, alignItems: 'center', position: 'relative' }}>
        {/* Previous Ball (Smaller) */}
        {prevNumber && (
          <Box sx={{ opacity: 0.7, transform: 'scale(0.8)', position: 'absolute', left: -180, top: 20 }}>
            <Typography variant="subtitle2" align="center" sx={{ mb: 1, fontWeight: 'bold', color: '#666' }}>ANTERIOR</Typography>
            <BingoBall 
              number={prevNumber} 
              letter={prevLetter} 
              size={100} 
            />
          </Box>
        )}

        {/* Current Ball (Large) */}
        <AnimatePresence>
          {showResult && internalNumber && (
            <motion.div
              initial={{ scale: 0, y: 100, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Box>
                <Typography variant="h6" align="center" sx={{ mb: 1, fontWeight: 'bold', color: '#333', textShadow: '0px 0px 10px white' }}>ACTUAL</Typography>
                <BingoBall 
                  key={`${internalLetter}-${internalNumber}`} 
                  number={internalNumber} 
                  letter={internalLetter} 
                  size={180} 
                  isNew={true}
                />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};
