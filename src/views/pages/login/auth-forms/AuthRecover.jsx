// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

//Firebase
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// project imports
import AnimateButton from 'modules/shared/components/extended/AnimateButton';
import { generateId } from 'modules/shared/utils/idGenerator';
import { fullDate } from 'modules/shared/utils/validations';
import { genConst } from 'store/constant';
import { createLog } from 'config/firebaseEvents';
import { collUsers } from 'store/collections';

const AuthRecover = ({ ...others }) => {
  const theme = useTheme();
  const auth = getAuth();

  return (
    <>
      <ToastContainer />
      <Formik
        initialValues={{
          email: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Debes ingresar un correo válido').max(255).required('Correo Electrónico es requerido')
        })}
        onSubmit={async (values, { resetForm }) => {
          sendPasswordResetEmail(auth, values.email)
            .then(() => {
              toast.success('Un correo electrónico fue enviado con el link para recuperar su contraseña!.', {
                position: toast.POSITION.TOP_RIGHT
              });
              const uidLog = generateId(20);
              //Log
              const userLog = {
                userId: 'NDUSR000',
                loginDate: fullDate(),
                email: values.email,
                state: genConst.CONST_STATE_IN,
                message: 'Recuperación de Contraseña.'
              };
              createLog(uidLog, userLog, collUsers);
              resetForm({ values: '' });
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode, errorMessage);
            });
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Correo Electrónico</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Correo Electrónico"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>
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
                  Recuperar
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthRecover;

