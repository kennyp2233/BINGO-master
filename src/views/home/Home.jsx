import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Grid, Typography, Box, TextField, InputAdornment, Container, Stack } from '@mui/material';
import { IconSearch } from '@tabler/icons';
import { gameService } from 'modules/features/default/main/services/gameService';
import MessageDark from 'components/message/MessageDark';
import MarketCard from 'modules/features/default/dashboard/components/MarketCard';

const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Verificar si hay parámetros de Payphone en la URL
    const transactionId = searchParams.get('id');
    const clientTransactionId = searchParams.get('clientTransactionId');

    if (transactionId && clientTransactionId) {
      // Redirigir automáticamente a la página de procesamiento de pagos
      console.log('🔄 Redirección automática detectada desde Payphone');
      console.log('Redirigiendo a /app/payment-response con parámetros:', {
        id: transactionId,
        clientTransactionId
      });

      navigate(`/app/payment-response?id=${transactionId}&clientTransactionId=${clientTransactionId}`, {
        replace: true
      });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await gameService.getActiveGamesList();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const results = events.filter(event =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(results);
  }, [searchTerm, events]);

  return (
    <>
      {/* Hero Section */}
      <Box sx={{
        py: 6,
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <Stack spacing={3} alignItems="center">
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3.5rem' },
                letterSpacing: '-0.02em',
              }}
            >
              Mercado de <span style={{ color: '#00adef' }}>Bingos</span>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: '600px',
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              Explora, compra y gana. La plataforma más segura para tus juegos de bingo favoritos.
            </Typography>

            <TextField
              fullWidth
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                maxWidth: '500px',
                mt: 2
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Container>
      </Box>

      {/* Events Grid */}
      <Container maxWidth="lg">
        <Box sx={{ py: 2 }}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Eventos Disponibles
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {filteredEvents.length} resultados
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((item) => (
                <Grid key={item.ide} item lg={3} md={4} sm={6} xs={12}>
                  <MarketCard
                    name={item.name}
                    date={item.startDate}
                    id={item.ide}
                    transmition={item.transmition}
                    state={item.state}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12} sx={{ mt: 4 }}>
                <MessageDark
                  message="No se encontraron eventos"
                  submessage={searchTerm ? "Intenta con otra búsqueda" : "Vuelve pronto para ver nuevos eventos"}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Home;
