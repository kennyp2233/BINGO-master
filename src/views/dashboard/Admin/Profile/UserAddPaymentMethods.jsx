import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography, FormControl, Button, InputLabel, OutlinedInput } from '@mui/material';

// project imports
import MainCard from 'modules/shared/components/cards/MainCard';

// Firebase
import { authentication, db } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// project imports
import AnimateButton from 'modules/shared/components/extended/AnimateButton';
import { collUserAddress } from 'store/collections';
import { fullDate } from 'utils/validations';

const CardWrapper = styled(MainCard)(() => ({
  backgroundColor: '#A9A9A9',
  borderWidth: 0,
  borderColor: '#fff',
  color: '#fff'
}));

const UserAddPaymentMethods = () => {
  const theme = useTheme();
  const [id, setId] = React.useState(null);

  useEffect(() => {
    onAuthStateChanged(authentication, async (user) => {
      if (user) {
        setId(user.uid);
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

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    focus: ''
  });

  const handleInputFocus = (e) => {
    setCardDetails({ ...cardDetails, focus: e.target.name });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
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
                    Añadir Tarjeta de Crédito / Débito
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ marginTop: 10 }}>
              <Grid item xs={12}>
                <Cards
                  number={cardDetails.number}
                  name={cardDetails.name}
                  expiry={cardDetails.expiry}
                  cvc={cardDetails.cvc}
                  focused={cardDetails.focus}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="number">Número de Tarjeta</InputLabel>
                  <OutlinedInput
                    id="number"
                    name="number"
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    value={cardDetails.number}
                    placeholder="0000 0000 0000 0000"
                    inputProps={{
                      maxLength: 16,
                      inputMode: 'numeric',
                      pattern: '[0-9s]{13,19}'
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="name">Nombre en Tarjeta</InputLabel>
                  <OutlinedInput
                    id="name"
                    type="text"
                    name="name"
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    value={cardDetails.name}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="expiry">Fecha Caducidad</InputLabel>
                  <OutlinedInput
                    id="expiry"
                    name="expiry"
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    value={cardDetails.expiry}
                    placeholder="12/25"
                    inputProps={{
                      maxLength: 5,
                      inputMode: 'numeric',
                      pattern: 'dd/dd'
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="cvc">CVC</InputLabel>
                  <OutlinedInput
                    id="cvc"
                    name="cvc"
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    value={cardDetails.cvc}
                    inputProps={{
                      maxLength: 3,
                      inputMode: 'numeric',
                      pattern: 'ddd'
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button size="large" variant="contained" color="secondary" style={{ width: 200 }} onClick={updateProfileData}>
                  Añadir
                </Button>
              </AnimateButton>
            </Box>
          </Grid>
        </Box>
      </CardWrapper>
    </>
  );
};

UserAddPaymentMethods.propTypes = {
  isLoading: PropTypes.bool
};

export default UserAddPaymentMethods;

