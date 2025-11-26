import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AppBar,
  Button,
  Drawer,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  IconButton,
  Avatar,
  Tooltip,
  ButtonBase
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { uiStyles } from './styles';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from '@mui/system';
import logo from 'assets/images/LogoBingo.png';
import defaultAvatar from 'assets/images/profile/profile-picture-6.jpg';
import { useAuth } from 'modules/features/auth/hooks/useAuth';
import { isSessionActive, getProfileUser } from 'config/firebaseEvents';
import { genConst } from 'store/constant';
import { IconDoorExit, IconTicket, IconHome } from '@tabler/icons';
import LoginModal from 'modules/features/auth/components/LoginModal';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';

const drawerWidth = 240;

const Header = (props) => {
  const theme = useTheme();
  let navigate = useNavigate();
  const { isLoggin, name } = useAuth();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openLoginModal, setOpenLoginModal] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleGoTo = () => {
    setOpenLoginModal(true);
  };

  const handleGoDash = () => {
    isSessionActive(navigate);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <img src={logo} alt="logobrand" width={130} />
      </Typography>
      <Divider />
      <List>
        <Box style={{ marginTop: 10 }}>
          <center>
            <Button variant="contained" startIcon={<PersonIcon />} onClick={handleGoTo}>
              Iniciar Sesión
            </Button>
          </center>
        </Box>
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <AppBar style={uiStyles.appbar} elevation={0} component="nav" position="static">
      <Toolbar style={uiStyles.appbarWrapper}>
        <div style={uiStyles.appbarTitle}>
          <Link to="/">
            <img src={logo} alt="logobrand" width={160} />
          </Link>
        </div>
        {isLoggin ? (
          <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Tooltip title="Inicio">
              <ButtonBase sx={{ borderRadius: '12px' }} onClick={() => navigate('/')}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: '#00adef',
                    color: theme.palette.secondary.dark,
                    '&:hover': {
                      background: theme.palette.secondary.light,
                      color: theme.palette.secondary.light
                    }
                  }}
                >
                  <IconHome stroke={1.5} size="1.3rem" color="#FFF" />
                </Avatar>
              </ButtonBase>
            </Tooltip>
            <Tooltip title="Mis Tickets">
              <ButtonBase sx={{ borderRadius: '12px' }} onClick={() => navigate('/app/my-tickets')}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.mediumAvatar,
                    transition: 'all .2s ease-in-out',
                    background: '#00adef',
                    color: theme.palette.secondary.dark,
                    '&:hover': {
                      background: theme.palette.secondary.light,
                      color: theme.palette.secondary.light
                    }
                  }}
                >
                  <IconTicket stroke={1.5} size="1.3rem" color="#FFF" />
                </Avatar>
              </ButtonBase>
            </Tooltip>
            <NotificationSection />
            <ProfileSection />
          </Box>
        ) : (
          <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
            <Button
              variant="contained"
              startIcon={<IconDoorExit color="#FFF" size={18} />}
              onClick={handleGoTo}
              style={{ width: 'auto', fontSize: 12, color: '#FFF', padding: '6px 16px' }}
            >
              Iniciar sesión / Crear Cuenta
            </Button>
          </Box>
        )}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ ml: 2, mr: 2, display: { xs: 'block', sm: 'block', md: 'none' } }}
        >
          <MenuIcon style={{ fontSize: 40 }} />
        </IconButton>
      </Toolbar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', sm: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <LoginModal
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        onSuccess={async (user) => {
          setOpenLoginModal(false);
          if (user) {
            const profile = await getProfileUser(user.uid);
            if (profile === genConst.CONST_PRO_ADM || profile === genConst.CONST_PRO_ADM_BING) {
              navigate('/main/dashboard');
            } else {
              navigate('/app/dashboard');
            }
          }
        }}
      />
    </AppBar>
  );
};

Header.propTypes = {
  window: PropTypes.func
};

export default Header;
