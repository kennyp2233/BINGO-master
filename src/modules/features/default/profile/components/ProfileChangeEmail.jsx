import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography, FormControl, FormHelperText, Button, InputLabel, OutlinedInput } from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Formik Inputs
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'components/extended/AnimateButton';
import { profileService } from '../index';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  height: 400
}));

const ProfileChangeEmail = ({ email }) => {
  const theme = useTheme();

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
                    Cambiar Correo Electrónico
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container alignItems="center">
                Correo Electrónico actual: <strong style={{ marginLeft: 10 }}>{email}</strong>
              </Grid>
            </Grid>
            <Formik
              initialValues={{
                newEmail: '',
                reNewEmail: '',
                password: ''
              }}
              validationSchema={Yup.object().shape({
                newEmail: Yup.string().email('Debes ingresar un correo válido').max(255).required('Correo Electrónico Nuevo es requerido'),
                reNewEmail: Yup.string().email('Debes ingresar un correo válido').max(255).required('Correo Electrónico Nuevo es requerido')
              })}
              onSubmit={async (values, { resetForm }) => {
                if (values.newEmail !== values.reNewEmail) {
                  toast.info('Los correos electrónicos no coinciden', { position: toast.POSITION.TOP_RIGHT });
                } else {
                  try {
                    await profileService.updateUserEmail(values.newEmail);
                    resetForm({ values: '' });
                    toast.success('Correo Electrónico actualizado correctamente!.', { position: toast.POSITION.TOP_RIGHT });
                    setTimeout(() => {
                      toast.success('Debes iniciar sesión con el nuevo correo electrónico!.', { position: toast.POSITION.TOP_RIGHT });
                    }, 3000);
                  } catch (error) {
                    resetForm({ values: '' });
                    if (error.code === 'auth/operation-not-allowed') {
                      toast.error('Por favor verifica el nuevo correo antes de cambiar el correo!.', {
                        position: toast.POSITION.TOP_RIGHT
                      });
                    } else if (error.code === 'auth/invalid-email') {
                      toast.error('Error Email no válido!.', {
                        position: toast.POSITION.TOP_RIGHT
                      });
                    } else {
                      console.log(error);
                    }
                  }
                }
              }}
            >
              {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container>
                    <Grid item xs={12}>
                      <FormControl fullWidth error={Boolean(touched.newEmail && errors.newEmail)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-new-email-register">Correo Electrónico Nuevo</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-new-email-register"
                          type="email"
                          value={values.newEmail}
                          name="newEmail"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                        />
                        {touched.newEmail && errors.newEmail && (
                          <FormHelperText error id="standard-weight-helper-text--register">
                            {errors.newEmail}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        error={Boolean(touched.reNewEmail && errors.reNewEmail)}
                        sx={{ ...theme.typography.customInput }}
                      >
                        <InputLabel htmlFor="outlined-adornment-re-new-email-register">Repetir Correo Electrónico Nuevo</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-re-new-email-register"
                          type="email"
                          value={values.reNewEmail}
                          name="reNewEmail"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                        />
                        {touched.reNewEmail && errors.reNewEmail && (
                          <FormHelperText error id="standard-weight-helper-text--register">
                            {errors.reNewEmail}
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
                        style={{ background: '#414551', color: '#FFF', height: 50, borderRadius: 12 }}
                      >
                        Actualizar Correo
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

ProfileChangeEmail.propTypes = {
  email: PropTypes.string,
  id: PropTypes.string
};

export default ProfileChangeEmail;