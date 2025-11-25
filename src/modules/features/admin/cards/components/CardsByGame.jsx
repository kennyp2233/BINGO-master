import { useEffect, useState, useRef } from 'react';
import { AppBar, Box, IconButton, OutlinedInput, Toolbar, Typography, Tooltip } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { uiStyles } from 'modules/features/admin/cards';
import { IconArrowLeft, IconPlus, IconSearch, IconTrash } from '@tabler/icons';
import { titles } from 'modules/features/admin/cards';
import { CardsTable } from './CardsTable';
import { GenerateCardModal } from './GenerateCardModal';
import { countCardsByEvent, deleteAllCardsByEvent } from 'modules/features/admin/cards';
import { getGameById } from 'modules/features/admin/events';
import { ReturnCardModal } from 'modules/features/admin/cards';

export default function CardsByGame() {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const refreshTableRef = useRef();

  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [event, setEvent] = useState(null);
  const [totalCards, setTotalCards] = useState(0);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (gameId) {
      getGameById(gameId).then((game) => {
        setEvent(game);
      });
    }
  }, [gameId]);

  const handleDeleteAllCards = async () => {
    if (totalCards > 0) {
      const confirmDelete = window.confirm('¿Está seguro que desea eliminar todas las cartillas?');
      if (confirmDelete) {
        // Delete all cards
        deleteAllCardsByEvent(gameId);
        refreshTableRef.current?.();
        setTotalCards(0);
      }
    }
  };

  return (
    <Box sx={uiStyles.box}>
      <AppBar position="static" style={uiStyles.appbar}>
        <Toolbar>
          <Tooltip title="Regresar">
            <IconButton color="inherit" onClick={() => handleBack()}>
              <IconArrowLeft color="#FFF" />
            </IconButton>
          </Tooltip>
          <GenerateCardModal event={event} totalCards={totalCards} onCardsGenerated={() => refreshTableRef.current?.()} />
          <ReturnCardModal eventId={gameId} onCardReturned={() => refreshTableRef.current?.()} />
          {/* <IconButton color="inherit" onClick={() => handleDeleteAllCards()}>
            <IconTrash color="#FFF" />
          </IconButton> */}
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#FFF' }} align="center">
            Generar Cartillas
          </Typography>
          <Tooltip title="Buscar">
            <IconButton
              color="inherit"
              onClick={() => {
                setShowSearch(!showSearch);
              }}
            >
              <IconSearch color="#FFF" />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      {showSearch && (
        <Box sx={uiStyles.box2}>
          <OutlinedInput
            id="searchField"
            type="text"
            name="searchField"
            onChange={(ev) => setSearch(ev.target.value)}
            placeholder={titles.searchPlace}
            style={{ width: '100%', marginTop: 10 }}
          />
        </Box>
      )}
      <CardsTable eventId={gameId} refreshRef={refreshTableRef} totalCards={totalCards} setTotalCards={setTotalCards} />
    </Box>
  );
}