import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Drawer, Fab, Grid, IconButton, Tooltip, Typography, Link } from '@mui/material';
import { IconBrandFacebook, IconBrandInstagram, IconBrandWhatsapp, IconBrandYoutube, IconDeviceMobile } from '@tabler/icons';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import SubCard from 'modules/shared/components/cards/SubCard';
import AnimateButton from 'modules/shared/components/extended/AnimateButton';
import { genConst, gridSpacing } from 'store/constant';

const Customization = () => {
  const theme = useTheme();

  // drawer on/off
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* toggle button */}
      <Tooltip title="Social">
        <Fab
          component="div"
          onClick={handleToggle}
          size="medium"
          variant="circular"
          color="secondary"
          sx={{
            borderRadius: 0,
            borderTopLeftRadius: '50%',
            borderBottomLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomRightRadius: '4px',
            top: '75%',
            position: 'fixed',
            right: 10,
            zIndex: theme.zIndex.speedDial
          }}
        >
          <AnimateButton type="rotate">
            <IconButton color="inherit" size="large" disableRipple>
              <IconDeviceMobile />
            </IconButton>
          </AnimateButton>
        </Fab>
      </Tooltip>

      <Drawer
        anchor="right"
        onClose={handleToggle}
        open={open}
        PaperProps={{
          sx: {
            width: 300,
            backgroundColor: '#ededed',
            borderStartStartRadius: 15,
            borderEndStartRadius: 15
          }
        }}
      >
        <PerfectScrollbar component="div">
          <Grid container spacing={gridSpacing} sx={{ p: 2 }}>
            <Grid item xs={12}>
              <SubCard title="Nuestras Redes Sociales">
                <Grid container>
                  <Grid item xs={4}>
                    <Tooltip title="Instagram">
                      <IconButton color="inherit" size="large" disableRipple>
                        <IconBrandInstagram size={40} strokeWidth={2} color={genConst.CONST_PRIMARY_COLOR} />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={4}>
                    <Tooltip title="Facebook">
                      <IconButton color="inherit" size="large" disableRipple>
                        <IconBrandFacebook size={40} strokeWidth={2} color={genConst.CONST_PRIMARY_COLOR} />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={4}>
                    <Tooltip title="Youtube">
                      <IconButton color="inherit" size="large" disableRipple>
                        <IconBrandYoutube size={40} strokeWidth={2} color={genConst.CONST_PRIMARY_COLOR} />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>
          </Grid>
          <Grid container spacing={gridSpacing} sx={{ p: 2 }}>
            <Grid item xs={12}>
              <center>
                <SubCard title="Escríbenos por WhatsApp">
                  <Typography
                    component={Link}
                    variant="subtitle1"
                    color="secondary"
                    href="https://wa.me/5491153754244?text=Hola%20amigos%20quisiera%20tener%20más%20información%20sobre%20sus%20cursos"
                    target="_blank"
                    sx={{ cursor: 'pointer' }}
                  >
                    <Tooltip title="WhatssApp">
                      <IconButton color="inherit" size="large" disableRipple>
                        <IconBrandWhatsapp size={40} strokeWidth={2} color={genConst.CONST_THIRD_COLOR} />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                </SubCard>
              </center>
            </Grid>
          </Grid>
        </PerfectScrollbar>
      </Drawer>
    </>
  );
};

export default Customization;


