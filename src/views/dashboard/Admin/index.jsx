import { useEffect, useState } from 'react';
// material-ui
import { Grid } from '@mui/material';
// data
import { gridSpacing } from 'store/constant';
// Services
import { getDashboardStats } from 'modules/features/admin/dashboard/services';
//Components
import TotalCard from 'components/cards/TotalCard';
import TotalYellowCard from 'components/cards/TotalYellowCard';
import EarningBlueCard from 'components/cards/EarningBlueCard';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: null,
    admins: null,
    cards: null,
    games: null,
    incomes: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item sm={6} xs={6} md={6} lg={3}>
            <TotalCard total={stats.users} detail="Usuarios" />
          </Grid>
          <Grid item sm={6} xs={6} md={6} lg={3}>
            <TotalCard total={stats.admins} detail="Administradores" />
          </Grid>
          <Grid item sm={6} xs={6} md={6} lg={3}>
            <TotalYellowCard total={stats.games} detail="Eventos" />
          </Grid>
          <Grid item sm={6} xs={6} md={6} lg={3}>
            <TotalYellowCard total={stats.cards} detail="Cartillas" />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={6}>
            <EarningBlueCard total={stats.incomes} detail="Ingresos" />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
