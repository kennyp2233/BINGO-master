import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// Material UI
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Typography, Button, Modal, Box, CircularProgress } from '@mui/material';
// Project imports
import AuthWrapper1 from '../AuthWrapper';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
import Logo from 'components/Logo-md';
// Assets
import bg01 from 'assets/images/bg/bg1.jpg';
import google from 'assets/images/google.webp';
// Firebase Google Provider
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { genConst } from 'store/constant';
import { createDocument, getProfileUser, isExistUser } from 'modules/shared';
import { collUsers } from 'store/collections';
// Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fullDate } from 'utils/validations';
import { createSearchParams } from 'react-router-dom';

const provider = new GoogleAuthProvider();

const Signin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const [openLoader, setOpenLoader] = useState(false);

  // Obtener datos del evento si vienen del state
  const eventData = location.state?.eventData;

  const handleLoginGoogle = async () => {
    try {
      setOpenLoader(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userExists = await isExistUser(user.uid);
      if (!userExists) {
        const userObject = {
          avatar: user.photoURL,
          createAt: fullDate(),
          email: user.email,
          fullName: user.displayName,
          id: user.uid,
          name: user.displayName,
          profile: genConst.CONST_PRO_DEF,
          state: genConst.CONST_STATE_AC,
          provider: 'Google'
        };
        await createDocument(collUsers, user.uid, userObject);
        toast.success('Usuario registrado correctamente!', { position: toast.POSITION.TOP_RIGHT });
      }

      setTimeout(() => {
        setOpenLoader(false);
        getProfileUser(user.uid).then((pro) => {
          if (pro == genConst.CONST_PRO_ADM || pro == genConst.CONST_PRO_ADM_BING) {
            navigate('/main/dashboard');
          } else {
            // Si hay datos del evento, redirigir al card-selector
            if (eventData?.path && eventData?.params) {
              navigate({
                pathname: eventData.path,
                search: createSearchParams(eventData.params).toString()
              });
            } else {
              navigate('/app/dashboard');
            }
          }
        });
      }, 2000);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Ups, algo salió mal!', { position: toast.POSITION.TOP_RIGHT });
      setOpenLoader(false);
    }
  };

  return (
    <AuthWrapper1>
      <ToastContainer />
      <Grid container direction="row" sx={{ minHeight: '100vh' }}>
        {/* Login Section (Left Side) */}
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
                  <AuthLogin />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <center>
                    <Typography variant="subtitle1">o inicia sesión con:</Typography>
                  </center>
                  <Button
                    disableElevation
                    fullWidth
                    size="large"
                    variant="outlined"
                    startIcon={<img src={google} alt="brand google" width={22} />}
                    style={{ color: '#00adef', height: 50, borderRadius: 12 }}
                    onClick={handleLoginGoogle}
                  >
                    Inicia sesión con Google
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <center>
                    <Typography variant="h4" textAlign="center" mb={1}>
                      Aún no tienes una cuenta?
                    </Typography>
                    <Typography component={Link} to="/auth/signup" variant="h5" sx={{ textDecoration: 'none' }} textAlign="center">
                      Regístrate
                    </Typography>
                  </center>
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

      <Modal open={openLoader} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <center>
          <Box sx={styleLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </AuthWrapper1>
  );
};

const styleLoader = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 80,
  height: 80,
  bgcolor: 'transparent',
  borderRadius: 6
};

export default Signin;
