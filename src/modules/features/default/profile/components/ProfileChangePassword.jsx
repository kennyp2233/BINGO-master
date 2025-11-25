import React, { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Typography,
  FormControl,
  FormHelperText,
  Button,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';

// Services
import { changeUserPassword } from '../services/profileService';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Formik Inputs
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'components/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const CardWrapper = styled(MainCard)(() => ({
  backgroundColor: '#414551',
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  height: 400
}));

const ProfileChangePassword = ({ email }) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <ToastContainer />
      <CardWrapper border={false} content={false}>
        <Box sx={{ p: 5 }}>
          <Grid container direction="column">
            <Grid item>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography component="span" variant="h3" sx={{ fontWeight: 600, color: '#FFF' }}>
                    Cambiar Contraseña
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container alignItems="center">
                Editar Contraseña{' '}
                <strong hidden style={{ marginLeft: 10 }}>
                  {email}
                </strong>
              </Grid>
            </Grid>
            <Formik
              initialValues={{
                newPassword: '',
                reNewPassword: '',
                submit: null
              }}
              validationSchema={Yup.object().shape({
                newPassword: Yup.string()
                  .min(6, 'Contraseña nueva debe tener al menos 6 caracteres')
                  .max(255)
                  .required('Contraseña Nueva es requerida'),
                reNewPassword: Yup.string()
                  .min(6, 'Contraseña nueva debe tener al menos 6 caracteres')
                  .max(255)
                  .required('Contraseña Nueva es requerida')
              })}
              onSubmit={async (values, { resetForm }) => {
                try {
                  await changeUserPassword(values.newPassword);
                  toast.success('Contraseña actualizada correctamente!.', { position: toast.POSITION.TOP_RIGHT });
                  resetForm({ values: '' });
                  setTimeout(() => {
                    toast.success('Debes volver a iniciar sesión!.', { position: toast.POSITION.TOP_RIGHT });
                  }, 3000);
                } catch (error) {
                  console.error('Error cambiando contraseña:', error);
                  toast.error('Error al actualizar la contraseña. Inténtalo de nuevo.', { position: toast.POSITION.TOP_RIGHT });
                }
              }}
            >
              {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container>
                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        error={Boolean(touched.newPassword && errors.newPassword)}
                        sx={{ ...theme.typography.customInput }}
                      >
                        <InputLabel htmlFor="outlined-adornment-new-password-register">Contraseña Nueva</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-new-password-register"
                          type={showPassword ? 'text' : 'password'}
                          value={values.newPassword}
                          name="newPassword"
                          label="Contraseña"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleChange(e);
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
                        {touched.newPassword && errors.newPassword && (
                          <FormHelperText error id="standard-weight-helper-text-password-register">
                            {errors.newPassword}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        error={Boolean(touched.reNewPassword && errors.reNewPassword)}
                        sx={{ ...theme.typography.customInput }}
                      >
                        <InputLabel htmlFor="outlined-adornment-re-new-password-register">Repite Contraseña Nueva</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-re-new-password-register"
                          type={showPassword ? 'text' : 'password'}
                          value={values.reNewPassword}
                          name="reNewPassword"
                          label="Contraseña"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleChange(e);
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
                        {touched.reNewPassword && errors.reNewPassword && (
                          <FormHelperText error id="standard-weight-helper-text-password-register">
                            {errors.reNewPassword}
                          </FormHelperText>
                        )}
                      </FormControl>

                      {errors.submit && (
                        <Box sx={{ mt: 3 }}>
                          <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                      )}
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4 }}>
                    <AnimateButton>
                      <Button
                        fullWidth
                        disabled={isSubmitting}
                        size="large"
                        type="submit"
                        variant="contained"
                        color="secondary"
                        style={{ color: '#FFF', height: 50, borderRadius: 12 }}
                      >
                        Actualizar Contraseña
                      </Button>
                    </AnimateButton>
                  </Box>
                </form>
              )}
            </Formik>
          </Grid>
        </Box>
      </CardWrapper>
    </>
  );
};

ProfileChangePassword.propTypes = {
  email: PropTypes.string,
  id: PropTypes.string
};

export default ProfileChangePassword;