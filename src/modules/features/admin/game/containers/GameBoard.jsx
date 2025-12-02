import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Modal, CircularProgress } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';

import { gameStyles } from '../styles/gameStyles';
import { useBingoGame } from '../hooks/useBingoGame';

import { WinnerModal } from '../modals/WinnerModal';
import { FinishGameModal } from '../modals/FinishGameModal';
import { EventSelector } from '../components/EventSelector';
import { GameActions } from '../components/GameActions';
import { WinnersListModal } from '../modals/WinnersListModal';
import { SettingsModal } from '../modals/SettingsModal';

import { BallDisplay } from '../components/Display/BallDisplay';
import { BingoGrid } from '../components/Display/BingoGrid';
import { GameControls } from '../components/Controls/GameControls';

export default function GameBoard() {
  const [showGameBoard, setShowGameBoard] = useState(false);
  const [selectedGame, setSelectedGame] = useState('');
  const [games, setGames] = useState([]);
  
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [showAllWinners, setShowAllWinners] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);

  const {
    bingoNumbers,
    currentNumber,
    currentLetter,
    prevNumber,
    prevLetter,
    resultBingo,
    winners,
    quinaWinners,
    checkingWinner,
    cont,
    drawNumber,
    addManualNumber,
    resetGame,
    quinaRules,
    setQuinaRules
  } = useBingoGame(selectedGame, games);

  // Effect to show winner modal when winners are found
  useEffect(() => {
    if (winners.length > 0 || quinaWinners.length > 0) {
      // Only show modal automatically for Bingo winners or if it's the first Quina winner
      // For now, let's just show it if there are new winners.
      // But since this effect runs on every render if winners.length > 0, we need to be careful.
      // The original code had this issue too.
      // Ideally we should track "seen" winners.
      // For now, let's keep the behavior but include Quina.
      setShowWinnerModal(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 10000);
    }
  }, [winners.length, quinaWinners.length]);

  const handleCloseWinner = () => {
    setShowWinnerModal(false);
  };

  const currentGame = games.find((game) => game.ide === selectedGame);

  if (!showGameBoard) {
    return (
      <EventSelector
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        setShowGameBoard={setShowGameBoard}
        games={games}
        setGames={setGames}
        quinaRules={quinaRules}
        setQuinaRules={setQuinaRules}
      />
    );
  }

  return (
    <>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <Box sx={gameStyles.box}>
        <ToastContainer />
        <center>
          <Typography variant="h2" style={{ color: '#04acec', fontWeight: 'bold', fontSize: 24, marginBottom: 10 }}>
            Jugando: {currentGame?.name}
          </Typography>
          
          <GameControls 
            onNext={drawNumber}
            onReset={resetGame}
            onShowWinners={() => setShowAllWinners(true)}
            onManualAdd={addManualNumber}
            onOpenSettings={() => setShowSettings(true)}
            cont={cont}
            checkingWinner={checkingWinner}
            hasWinner={winners.length > 0}
          />
        </center>

        <Grid container style={{ marginTop: 10 }}>
          <Grid item xs={12}>
            <BallDisplay 
              number={currentNumber}
              letter={currentLetter}
              prevNumber={prevNumber}
              prevLetter={prevLetter}
            />
          </Grid>
        </Grid>

        <BingoGrid drawnNumbers={bingoNumbers} />

        <GameActions
          resultBingo={resultBingo}
          setShowConfirmFinish={setShowConfirmFinish}
          winners={winners}
          setShowWinner={() => setShowWinnerModal(true)}
          setOpenLoader={setOpenLoader}
          bingoNumbers={bingoNumbers}
          selectedGame={selectedGame}
        />

        {/* Modals */}
        <WinnerModal
          showWinner={showWinnerModal}
          handleCloseWinner={handleCloseWinner}
          winners={winners}
          quinaWinners={quinaWinners}
        />

        <FinishGameModal
          showConfirmFinish={showConfirmFinish}
          setShowConfirmFinish={setShowConfirmFinish}
        />

        <WinnersListModal
          open={showAllWinners}
          handleClose={() => setShowAllWinners(false)}
          eventId={selectedGame}
          bingoWinners={winners}
          quinaWinners={quinaWinners}
        />

        <SettingsModal
          open={showSettings}
          onClose={() => setShowSettings(false)}
          quinaRules={quinaRules}
          setQuinaRules={setQuinaRules}
        />

        <Modal open={openLoader} aria-labelledby="modal-loader" aria-describedby="modal-loader">
          <center>
            <Box sx={gameStyles.styleLoader}>
              <CircularProgress color="info" size={100} />
            </Box>
          </center>
        </Modal>
      </Box>
    </>
  );
}
