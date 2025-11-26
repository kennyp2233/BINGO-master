import React, { useState, useRef, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';

//Firebase
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'components/cards/MainCard';
import Transitions from 'components/extended/Transitions';
import User1 from 'assets/images/profile/profile-picture-6.jpg';

// assets
import { IconLogout, IconUser, IconLock } from '@tabler/icons';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();

  const [photoURL, setPhotoURL] = useState(null);
  const [open, setOpen] = useState(false);
  const auth = getAuth();
  const anchorRef = useRef(null);

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        setPhotoURL(user.photoURL);
      }
    });
  }, []);

  const handleLogout = async () => {
    signOut(auth)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Tooltip title="Perfil">
        <Chip
          sx={{
            width: '48px',
            height: '48px',
            alignItems: 'center',
            borderRadius: '27px',
            transition: 'all .2s ease-in-out',
            borderColor: theme.palette.primary.light,
            backgroundColor: theme.palette.primary.light,
            '&[aria-controls="menu-list-grow"], &:hover': {
              borderColor: theme.palette.primary.main,
              background: `${theme.palette.primary.main}!important`,
              color: theme.palette.primary.light,
              '& svg': {
                stroke: theme.palette.primary.light
              }
            },
            '& .MuiChip-label': {
              lineHeight: 0
            }
          }}
          icon={
            <Avatar
              src={photoURL || User1}
              sx={{
                margin: '8px 0 8px 21px !important',
                cursor: 'pointer'
              }}
              ref={anchorRef}
              aria-controls={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              color="inherit"
            />
          }
          variant="outlined"
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          color="primary"
        />
      </Tooltip>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2 }}>
                    <Stack direction="row" spacing={0.5} alignItems="center" style={{ marginLeft: 15, marginTop: 10 }}>
                      <Typography variant="h4">Hola,</Typography>
                      <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                        {auth.currentUser.displayName}
                      </Typography>
                    </Stack>
                    <Divider style={{ marginTop: 20, marginBottom: 20 }} />
                  </Box>
                  <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden', marginTop: '-50px' }}>
                    <Box sx={{ p: 2 }}>
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0.5
                          }
                        }}
                      >
                        <Link to="/app/user-profile" style={{ textDecoration: 'none' }}>
                          <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px` }} onClick={handleClose}>
                            <ListItemIcon>
                              <IconUser stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body2">Cuenta</Typography>} />
                          </ListItemButton>
                        </Link>
                        <Link to="/app/user-security" style={{ textDecoration: 'none' }}>
                          <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px` }} onClick={handleClose}>
                            <ListItemIcon>
                              <IconLock stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body2">Seguridad</Typography>} />
                          </ListItemButton>
                        </Link>
                        <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px` }} onClick={handleLogout}>
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Cerrar Sesión</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
