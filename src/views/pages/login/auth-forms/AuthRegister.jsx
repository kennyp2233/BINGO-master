/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, createSearchParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  useMediaQuery,
  Modal
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// Firebase
import { authentication, db } from 'config/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// project imports
import AnimateButton from 'modules/shared/components/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

//Utils
import { fullDate, generateDate } from 'utils/validations';
import { genConst } from 'store/constant';
import { collUsers, collNotifications } from 'store/collections';
import { createDocument, createLog } from 'modules/shared';
import { generateId } from 'utils/idGenerator';

const AuthRegister = ({ ...others }) => {
  let navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = useState(false);

  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  const [openLoader, setOpenLoader] = React.useState(false);

  // Obtener datos del evento si vienen del state
  const eventData = location.state?.eventData;

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        navigate('/app/dashboard');
      }
    });
  }, []);

  const createUserAditionalData = (uid, email) => {
    const uidLog = generateId(20);
    //Log
    const userLog = {
      userId: uid,
      loginDate: fullDate(),
      email: email,
      state: genConst.CONST_STATE_IN,
      message: 'Registro de nuevo usuario.'
    };
    createLog(uidLog, userLog, collUsers);
    //Notifications
    const notifications = {
      to: email,
      from: 'Play BINGO',
      date: generateDate(),
      message: 'No olvides actualizar tu información de perfil.',
      subject: 'Notificación',
      state: genConst.CONST_NOTIF_NL
    };
    createDocument(collNotifications, uid, notifications);
  };

  return (
    <>
      <ToastContainer />
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phone: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().required('Ingresa el Nombre'),
          lastName: Yup.string().required('Ingresa el Apellido'),
          email: Yup.string().email('Debes ingresar un correo válido').max(255).required('Correo Electrónico es requerido'),
          password: Yup.string().min(6, 'Contraseña debe tener al menos 6 caracteres').max(255).required('Contraseña es requerida')
        })}
        onSubmit={async (values, { resetForm }) => {
          setOpenLoader(true);
          createUserWithEmailAndPassword(authentication, values.email, values.password)
            .then((userCredential) => {
              const user = userCredential.user;
              updateProfile(authentication.currentUser, {
                displayName: values.firstName + ' ' + values.lastName
              });
              setDoc(doc(db, collUsers, user.uid), {
                avatar: null,
                createAt: fullDate(),
                email: values.email,
                fullName: values.firstName + ' ' + values.lastName,
                id: user.uid,
                lastName: values.lastName,
                name: values.firstName,
                phone: null,
                profile: genConst.CONST_PRO_DEF,
                state: genConst.CONST_STATE_AC,
                url: null,
                provider: 'Firebase'
              });
              createUserAditionalData(user.uid, values.email);
              resetForm({ values: '' });
              toast.success('Usuario registrado correctamente!.', { position: toast.POSITION.TOP_RIGHT });
              setTimeout(() => {
                setOpenLoader(false);
                // Si hay datos del evento, redirigir al card-selector
                if (eventData?.path && eventData?.params) {
                  navigate({
                    pathname: eventData.path,
                    search: createSearchParams(eventData.params).toString()
                  });
                } else {
                  navigate('/app/dashboard');
                }
              }, 2000);
            })
            .catch((error) => {
              if (error.code === 'auth/user-not-found') {
                toast.error('Upsss! Usuario no encontrado. Por favor regístrate.', { position: toast.POSITION.TOP_RIGHT });
              } else if (error.code === 'auth/wrong-password') {
                toast.error('Upsss! Contraseña incorrecta.', { position: toast.POSITION.TOP_RIGHT });
              } else if (error.code === 'auth/user-disabled') {
                toast.error('Upsss! Tu cuenta se encuentra inhabilitada!.', { position: toast.POSITION.TOP_RIGHT });
              } else if (error.code === 'auth/email-already-in-use') {
                toast.error('Upsss! Tu correo ya se encuentra registrado!.', { position: toast.POSITION.TOP_RIGHT });
              } else if (error.code === 'auth/internal-error') {
                toast.error('Error interno, por favor comuniquese con el administrador del sistema!.', {
                  position: toast.POSITION.TOP_RIGHT
                });
              } else if (error.code === 'auth/network-request-failed') {
                toast.error('Error en la red, por favor intente más tarde!.', { position: toast.POSITION.TOP_RIGHT });
              } else {
                console.log(error);
              }
              setOpenLoader(false);
            });
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={matchDownSM ? 0 : 2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.firstName && errors.firstName)} sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="outlined-adornment-firstName-register">Nombre</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-firstName-register"
                    type="text"
                    value={values.firstName}
                    name="firstName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    inputProps={{}}
                  />
                  {touched.firstName && errors.firstName && (
                    <FormHelperText error id="standard-weight-helper-text--register">
                      {errors.firstName}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.lastName && errors.lastName)} sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="outlined-adornment-lastName-register">Apellido</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-lastName-register"
                    type="text"
                    value={values.lastName}
                    name="lastName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    inputProps={{}}
                  />
                  {touched.lastName && errors.lastName && (
                    <FormHelperText error id="standard-weight-helper-text--register">
                      {errors.lastName}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-register">Correo Electrónico</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-register"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text--register">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-register">Contraseña</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-register"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                label="Contraseña"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
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
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-register">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            {strength !== 0 && (
              <FormControl fullWidth>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            )}
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
                  Registrarse
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
      <Modal open={openLoader} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <center>
          <Box sx={styleLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </>
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
  border: 'none',
  borderRadius: 6,
  boxShadow: 0,
  p: 4
};

export default AuthRegister;

