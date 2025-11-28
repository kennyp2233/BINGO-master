/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, createSearchParams } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Modal
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
//Firebase
import { authentication } from 'config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { createLog, getProfileUser, isSessionActive } from 'config/firebaseEvents';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
// project imports
import AnimateButton from 'modules/shared/components/extended/AnimateButton';
//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { genConst } from 'store/constant';
import { fullDate } from 'utils/validations';
import { generateId } from 'utils/idGenerator';
import { collUsers } from 'store/collections';

const AuthLogin = ({ ...others }) => {
  let navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  // Obtener datos del evento si vienen del state
  const eventData = location.state?.eventData;

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    isSessionActive(navigate);
  }, []);

  return (
    <>
      <ToastContainer />
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Debe ser un correo válido').max(255).required('Correo Electrónico es requerido'),
          password: Yup.string().max(255).required('Contraseña es requerida')
        })}
        onSubmit={async (values) => {
          setOpen(true);
          signInWithEmailAndPassword(authentication, values.email, values.password)
            .then((userCredencials) => {
              const user = userCredencials.user;
              const uidLog = generateId(20);
              //Log
              const userLog = {
                userId: user.uid,
                loginDate: fullDate(),
                email: values.email,
                state: genConst.CONST_STATE_IN,
                message: 'Inicio de sesión.'
              };
              createLog(uidLog, userLog, collUsers);
              setTimeout(() => {
                setOpen(false);
                getProfileUser(user.uid).then((pro) => {
                  if (pro == genConst.CONST_PRO_ADM || pro == genConst.CONST_PRO_ADM_BING) {
                    navigate('/main/dashboard');
                  } else {
                    // Si hay datos del evento, redirigir al card-selector
                    if (eventData?.path && eventData?.params) {
                      navigate({
                        pathname: eventData.path,
                        search: createSearchParams(eventData.params).toString()
                      }, {
                        state: eventData.extraState
                      });
                    } else {
                      navigate('/app/dashboard');
                    }
                  }
                });
              }, 2000);
            })
            .catch((error) => {
              setOpen(false);
              if (error.code === 'auth/user-not-found') {
                toast.error('Upsss! Usuario no encontrado. Por favor regístrate.', { position: toast.POSITION.TOP_RIGHT });
              } else if (error.code === 'auth/wrong-password') {
                toast.error('Upsss! Contraseña incorrecta.', { position: toast.POSITION.TOP_RIGHT });
              } else if (error.code === 'auth/user-disabled') {
                toast.error('Upsss! Tu cuenta se encuentra inhabilitada!.', { position: toast.POSITION.TOP_RIGHT });
                const uidLog = generateId(20);
                //Log
                const recordLog = {
                  userId: 'NDUSR000',
                  loginDate: fullDate(),
                  email: values.email,
                  state: genConst.CONST_STATE_IN,
                  message: 'Cuenta Inhabilitada.'
                };
                createLog(uidLog, recordLog, collUsers);
              } else if (error.code === 'auth/invalid-login-credentials') {
                toast.error('Upsss! Datos de inicio de sesión no válidos!.', { position: toast.POSITION.TOP_RIGHT });
              } else if (error.code === 'auth/internal-error') {
                toast.error('Error interno, por favor comuniquese con el administrador del sistema!.', {
                  position: toast.POSITION.TOP_RIGHT
                });
              } else if (error.code === 'auth/network-request-failed') {
                toast.error('Error en la red, por favor intente más tarde!.', { position: toast.POSITION.TOP_RIGHT });
              } else {
                console.log(error);
              }
            });
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Correo Electrónico / Username</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Correo Electrónico / Username"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Contraseña</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Contraseña"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Typography
                component={Link}
                variant="subtitle1"
                to="/auth/password-recovery"
                color="secondary"
                sx={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                Olvidaste tu contraseña?
              </Typography>
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  style={{ color: '#FFF', height: 50, borderRadius: 12 }}
                >
                  Iniciar Sesión
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
      <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <center>
          <Box sx={style}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 80,
  height: 80,
  bgcolor: 'transparent',
  border: 'none',
  borderRadius: 6,
  boxShadow: 0,
  p: 4
};

export default AuthLogin;

