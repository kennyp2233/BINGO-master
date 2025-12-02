import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography, FormControl, Button, InputLabel, OutlinedInput } from '@mui/material';

// project imports
import MainCard from 'modules/shared/components/cards/MainCard';

// Firebase
import { authentication, db } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { updateDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// project imports
import AnimateButton from 'modules/shared/components/extended/AnimateButton';
import { collUserAddress } from 'store/collections';
import { fullDate } from 'modules/shared/utils/validations';

const CardWrapper = styled(MainCard)(() => ({
  backgroundColor: '#A9A9A9',
  borderWidth: 0,
  borderColor: '#fff',
  color: '#fff'
}));

const UserAddress = () => {
  const theme = useTheme();
  const [id, setId] = React.useState(null);
  const [city, setCity] = React.useState(null);
  const [province, setProvince] = React.useState(null);
  const [principal, setPrincipal] = React.useState(null);
  const [secondary, setSecondary] = React.useState(null);
  const [number, setNumber] = React.useState(null);
  const [reference, setReference] = React.useState(null);

  useEffect(() => {
    onAuthStateChanged(authentication, async (user) => {
      if (user) {
        setId(user.uid);
        const q = query(collection(db, collUserAddress), where('idUser', '==', user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setCity(doc.data().city);
          setProvince(doc.data().province);
          setPrincipal(doc.data().principal);
          setSecondary(doc.data().secondary);
          setNumber(doc.data().number);
          setReference(doc.data().reference);
        });
      }
    });
  }, []);

  const updateProfileData = () => {
    if (!city) {
      toast.info('Ciudad es requerida!', { position: toast.POSITION.TOP_RIGHT });
    } else {
      updateDoc(doc(db, collUserAddress, id), {
        city: city,
        province: province,
        principal: principal,
        secondary: secondary,
        number: number,
        reference: reference,
        updateAt: fullDate()
      });
      toast.success('Datos de Dirección actualizado correctamente!', { position: toast.POSITION.TOP_RIGHT });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
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
                    Dirección
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput, padding: 0.2, paddingRight: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-city-register">Ciudad</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-city-register"
                    type="text"
                    value={city || ''}
                    name="city"
                    onChange={(ev) => setCity(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput, padding: 0.2, paddingRight: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-province-register">Provincia</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-province-register"
                    type="text"
                    value={province || ''}
                    name="province"
                    onChange={(ev) => setProvince(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput, padding: 0.2, paddingRight: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-principal-register">Calle Principal</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-principal-register"
                    type="text"
                    value={principal || ''}
                    name="principal"
                    onChange={(ev) => setPrincipal(ev.target.value)}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={9}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput, padding: 0.2, paddingRight: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-secondary-register">Calle Secundaria</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-secondary-register"
                    type="text"
                    value={secondary || ''}
                    name="secondary"
                    onChange={(ev) => setSecondary(ev.target.value)}
                    inputProps={{}}
                    maxRows={5}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput, padding: 0.2, paddingRight: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-number-register">Número</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-secondary-register"
                    type="text"
                    value={number || ''}
                    name="number"
                    onChange={(ev) => setNumber(ev.target.value)}
                    inputProps={{}}
                    maxRows={5}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput, padding: 0.2, paddingRight: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-reference-register">Referencia</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-reference-register"
                    type="text"
                    value={reference || ''}
                    name="reference"
                    onChange={(ev) => setReference(ev.target.value)}
                    inputProps={{}}
                    maxRows={5}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button size="large" variant="contained" color="secondary" style={{ width: 200 }} onClick={updateProfileData}>
                  Guardar
                </Button>
              </AnimateButton>
            </Box>
          </Grid>
        </Box>
      </CardWrapper>
    </>
  );
};

UserAddress.propTypes = {
  isLoading: PropTypes.bool
};

export default UserAddress;

