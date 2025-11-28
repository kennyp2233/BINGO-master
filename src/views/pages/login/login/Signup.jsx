import { Link } from 'react-router-dom';
// Material UI
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
// Project imports
import AuthWrapper1 from '../AuthWrapper';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'modules/shared/components/Logo-md';
import AuthRegister from '../auth-forms/AuthRegister';

// Assets
import bg01 from 'assets/images/bg/bg2.jpg';

const Signup = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container direction="row" sx={{ minHeight: '100vh' }}>
        {/* Sign Up Section (Left Side) */}
        <Grid
          item
          xs={12}
          md={5}
          container
          alignItems="center"
          justifyContent="center"
          sx={{ backgroundColor: theme.palette.background.default, padding: 3 }}
        >
          <Grid item xs={12} sm={12} md={12}>
            <AuthCardWrapper>
              <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item>
                  <Logo />
                </Grid>
                <Grid item xs={12}>
                  <Stack alignItems="center" justifyContent="center" spacing={1}>
                    <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h4' : 'h3'}>
                      Regístrate
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <AuthRegister />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Grid item container direction="column" alignItems="center" xs={12}>
                    <Typography component={Link} to="/auth/signin" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                      Ya tienes una cuenta?
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </AuthCardWrapper>
          </Grid>
        </Grid>

        {/* Wallpaper Section (Right Side) */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            backgroundImage: `url(${bg01})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        ></Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Signup;

