// project imports
import { Outlet } from 'react-router-dom';
import Header from 'modules/shared/components/Header';
import { CssBaseline, Container, Box, useTheme } from '@mui/material';
import Footer from 'modules/shared/components/Footer';

const HomeLayout = () => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <CssBaseline />

      {/* Header fijo */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1100, bgcolor: theme.palette.background.default }}>
        <Header />
      </Box>

      {/* Contenido principal */}
      <Container
        maxWidth="xl"
        sx={{
          flexGrow: 1,
          py: 4,
          mt: 4,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Outlet />
      </Container>

      <Footer />
    </Box>
  );
};

export default HomeLayout;
