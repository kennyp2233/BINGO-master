import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { uiStyles } from 'modules/features/admin/cards';
import { AppBar, Box, Toolbar, Typography, Card, CardContent, Grid, Paper, Chip, CircularProgress, Container } from '@mui/material';
import { IconCalendar, IconTicket, IconCurrencyDollar, IconChartBar, IconUsers } from '@tabler/icons';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from 'config/firebase';

export default function StatsCardGame() {
  const { gameId } = useParams();
  const UNAVAILABLE_STATE = 0; // Estado para cartillas vendidas
  const AVAILABLE_STATE = 1; // Estado para cartillas disponibles

  const [totalCards, setTotalCards] = useState(0);
  const [soldCards, setSoldCards] = useState(0);
  const [availableCards, setAvailableCards] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!gameId) return;

      try {
        setLoading(true);
        // Filtrar cartillas por el gameId específico
        const cardsRef = collection(db, 'Cards');
        const gameCardsQuery = query(cardsRef, where('event', '==', gameId));

        // Total de cartillas para este juego
        const totalSnap = await getCountFromServer(gameCardsQuery);
        const total = totalSnap.data().count;
        setTotalCards(total);

        // Cartillas vendidas (state === 1)
        const soldQuery = query(cardsRef, where('event', '==', gameId), where('state', '==', UNAVAILABLE_STATE));
        const soldSnap = await getCountFromServer(soldQuery);
        const sold = soldSnap.data().count;
        setSoldCards(sold);

        // Cartillas disponibles (state === 0)
        const availableQuery = query(cardsRef, where('event', '==', gameId), where('state', '==', AVAILABLE_STATE));
        const availableSnap = await getCountFromServer(availableQuery);
        const available = availableSnap.data().count;
        setAvailableCards(available);
      } catch (error) {
        console.error('Error al obtener los conteos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [gameId]);

  const statsCards = [
    {
      title: 'Total de Cartillas',
      value: totalCards,
      icon: <IconTicket size={32} />,
      color: '#2196F3',
      bgColor: '#E3F2FD'
    },
    {
      title: 'Cartillas Vendidas',
      value: soldCards,
      icon: <IconCurrencyDollar size={32} />,
      color: '#4CAF50',
      bgColor: '#E8F5E8'
    },
    {
      title: 'Cartillas Disponibles',
      value: availableCards,
      icon: <IconChartBar size={32} />,
      color: '#FF9800',
      bgColor: '#FFF3E0'
    }
  ];

  const getPercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <Box sx={uiStyles.box}>
      <AppBar position="static" style={uiStyles.appbar}>
        <Toolbar>
          <IconCalendar color="#FFF" />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#FFF' }} align="center">
            Estadísticas del Evento
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {/* Cards de estadísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {statsCards.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    elevation={3}
                    sx={{
                      height: '100%',
                      background: `linear-gradient(135deg, ${stat.bgColor} 0%, #ffffff 100%)`,
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Box
                          sx={{
                            backgroundColor: stat.color,
                            borderRadius: '12px',
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Chip
                          label={`${getPercentage(stat.value, totalCards)}%`}
                          size="small"
                          sx={{
                            backgroundColor: stat.color,
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>

                      <Typography
                        variant="h3"
                        component="div"
                        sx={{
                          fontWeight: 'bold',
                          color: stat.color,
                          mb: 1
                        }}
                      >
                        {stat.value.toLocaleString()}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {stat.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Resumen adicional */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                Resumen del Evento
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Tasa de Venta
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                      {getPercentage(soldCards, totalCards)}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Cartillas Restantes
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
                      {availableCards.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Estado del Evento
                    </Typography>
                    <Chip
                      label={soldCards === totalCards ? 'Agotado' : 'Disponible'}
                      color={soldCards === totalCards ? 'error' : 'success'}
                      variant="filled"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      ID del Evento
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#666' }}>
                      {gameId}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </>
        )}
      </Container>
    </Box>
  );
}