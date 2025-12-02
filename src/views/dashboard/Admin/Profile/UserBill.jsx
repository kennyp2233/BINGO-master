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
import { collUserBillData } from 'store/collections';
import { fullDate } from 'modules/shared/utils/validations';

const CardWrapper = styled(MainCard)(() => ({
  backgroundColor: '#A9A9A9',
  borderWidth: 0,
  borderColor: '#fff',
  color: '#fff'
}));

const UserBill = () => {
  const theme = useTheme();
  const [id, setId] = React.useState(null);
  const [name, setName] = React.useState(null);
  const [ci, setCi] = React.useState(null);
  const [city, setCity] = React.useState(null);
  const [address, setAddress] = React.useState(null);
  const [phone, setPhone] = React.useState(null);
  const [email, setEmail] = React.useState(null);

  useEffect(() => {
    onAuthStateChanged(authentication, async (user) => {
      if (user) {
        setId(user.uid);
        const q = query(collection(db, collUserBillData), where('idUser', '==', user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setName(doc.data().name);
          setCi(doc.data().ci);
          setCity(doc.data().city);
          setAddress(doc.data().address);
          setPhone(doc.data().phone);
          setEmail(doc.data().email);
        });
      }
    });
  }, []);

  const updateProfileData = () => {
    if (!name) {
      toast.info('Nombre o Razón Social es requerida!', { position: toast.POSITION.TOP_RIGHT });
    } else {
      updateDoc(doc(db, collUserBillData, id), {
        name: name,
        ci: ci,
        city: city,
        address: address,
        phone: phone,
        email: email,
        updateAt: fullDate()
      });
      toast.success('Datos de Facturación actualizada correctamente!', { position: toast.POSITION.TOP_RIGHT });
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
                    Datos de Facturación
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={8}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput, padding: 0.2, paddingRight: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-name-register">Nombre / Razón Social</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-name-register"
                    type="text"
                    value={name || ''}
                    name="name"
                    onChange={(ev) => setName(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput, padding: 0.2, paddingRight: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-ci-register">Ci / R.U.C.</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-ci-register"
                    type="number"
                    value={ci || ''}
                    name="ci"
                    onChange={(ev) => setCi(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
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
              <Grid item xs={8}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput, padding: 0.2, paddingRight: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-address-register">Dirección</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-address-register"
                    type="text"
                    value={address || ''}
                    name="address"
                    onChange={(ev) => setAddress(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput, padding: 0.2, paddingRight: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-phone-register">Teléfono</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-phone-register"
                    type="number"
                    value={phone || ''}
                    name="phone"
                    onChange={(ev) => setPhone(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput, padding: 0.2 }}>
                  <InputLabel htmlFor="outlined-adornment-email-register">Email</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-email-register"
                    type="email"
                    value={email || ''}
                    name="email"
                    onChange={(ev) => setEmail(ev.target.value)}
                    inputProps={{}}
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

UserBill.propTypes = {
  isLoading: PropTypes.bool
};

export default UserBill;

