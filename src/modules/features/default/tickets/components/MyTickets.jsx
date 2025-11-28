import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Container
} from '@mui/material';
import { IconCircleX, IconTicket } from '@tabler/icons';
import { uiStyles } from './MyTickets.styles';
import { getAllEvents, getUserCardsForEvent, formatCardNumber } from '../services/ticketsService';
import { genConst } from 'store/constant';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';
import MessageDark from 'modules/shared/components/message/MessageDark';
import TicketItem from './TicketItem';
import CustomModal from 'modules/shared/components/Modal';
import BingoCard from 'modules/shared/components/bingo/BingoCard';

function MyTickets() {
  const [loading, setLoading] = useState(true);
  const [ticketsByEvent, setTicketsByEvent] = useState([]);
  const [userId, setUserId] = useState(null);

  // Modal state
  const [openCard, setOpenCard] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authentication, async (user) => {
      if (user) {
        setUserId(user.uid);
        fetchData(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchData = async (uid) => {
    try {
      setLoading(true);
      // 1. Get all events
      const events = await getAllEvents();

      // 2. For each event, get user cards
      const eventsWithTickets = await Promise.all(
        events.map(async (event) => {
          const cards = await getUserCardsForEvent(event.ide, uid);
          return {
            ...event,
            cards: cards || []
          };
        })
      );

      // 3. Filter out events with 0 tickets
      const filteredEvents = eventsWithTickets.filter(event => event.cards.length > 0);

      setTicketsByEvent(filteredEvents);
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCard = (ticket) => {
    setSelectedTicket(ticket);
    setOpenCard(true);
  };

  const handleCloseCard = () => {
    setOpenCard(false);
    setSelectedTicket(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" sx={{ mb: 4, color: 'text.primary', textAlign: 'center' }}>
        Mis Cartillas
      </Typography>

      {ticketsByEvent.length > 0 ? (
        ticketsByEvent.map((event) => (
          <Paper key={event.ide} elevation={2} sx={{ mb: 4, p: 3, borderRadius: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" color="primary" gutterBottom>
                {event.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Fecha: {event.startDate}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              {event.cards.map((ticket) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={ticket.id}>
                  <TicketItem
                    ticket={ticket}
                    onClick={handleOpenCard}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        ))
      ) : (
        <Box sx={{ mt: 5 }}>
          <MessageDark
            message={'No tienes cartillas aún'}
            submessage="Compra cartillas en los eventos disponibles para verlas aquí."
          />
        </Box>
      )}

      {/* View Card Modal */}
      <CustomModal
        open={openCard}
        handleClose={handleCloseCard}
        title={selectedTicket ? `Cartilla: ${formatCardNumber(selectedTicket.num)}` : ''}
        width={400}
      >
        {selectedTicket && (
          <Box sx={{ mt: 2 }}>
            <BingoCard
              bN={selectedTicket.b}
              iN={selectedTicket.i}
              nN={selectedTicket.n}
              gN={selectedTicket.g}
              oN={selectedTicket.o}
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<IconCircleX />}
                onClick={handleCloseCard}
                sx={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF' }}
              >
                Cerrar
              </Button>
            </Box>
          </Box>
        )}
      </CustomModal>
    </Container>
  );
}

export default MyTickets;
