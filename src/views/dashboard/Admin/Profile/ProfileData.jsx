import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Typography, FormControl, Button, InputLabel, OutlinedInput } from '@mui/material';

// project imports
import MainCard from 'modules/shared/components/cards/MainCard';

// Firebase
import { authentication, db } from 'config/firebase';
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import { updateDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// project imports
import AnimateButton from 'modules/shared/components/extended/AnimateButton';
import { collUsers } from 'store/collections';
import { fullDate } from 'modules/shared/utils/validations';

const CardWrapper = styled(MainCard)(() => ({
  backgroundColor: '#414551',
  color: '#fff',
  overflow: 'hidden',
  position: 'relative'
}));

const ProfileData = () => {
  const theme = useTheme();
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authentication, async (user) => {
      if (user) {
        setId(user.uid);
        setEmail(user.email);
        const q = query(collection(db, collUsers), where('id', '==', user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setName(doc.data().name);
          setLastName(doc.data().lastName);
          setPhone(doc.data().phone);
        });
      }
    });
  }, []);

  const updateProfileData = () => {
    if (!name) {
      toast.info('Nombre es requerido!', { position: toast.POSITION.TOP_RIGHT });
    } else {
      updateProfile(authentication.currentUser, {
        displayName: name + ' ' + lastName
      });
      updateDoc(doc(db, collUsers, id), {
        name: name,
        lastName: lastName,
        fullName: name + ' ' + lastName,
        phone: phone,
        updateAt: fullDate()
      });
      toast.success('Perfil actualizado correctamente!', { position: toast.POSITION.TOP_RIGHT });
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
                    Datos de Usuario
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item hidden>
              <Grid container alignItems="center">
                Editar Perfil <span hidden>{email}</span>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput, padding: 0.2, paddingRight: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-name-register">Nombre</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-name-register"
                    type="text"
                    value={name || ''}
                    name="name"
                    onChange={(ev) => setName(ev.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput, padding: 0.2, paddingRight: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-name-register">Apellido</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-name-register"
                    type="text"
                    value={lastName || ''}
                    name="lastName"
                    onChange={(ev) => setLastName(ev.target.value)}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput, padding: 0.2 }}>
                  <InputLabel htmlFor="outlined-adornment-phone-register">Teléfono</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-phone-register"
                    type="text"
                    value={phone || ''}
                    name="phone"
                    onChange={(ev) => setPhone(ev.target.value)}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  style={{ borderRadius: 10, color: '#FFF', height: 50 }}
                  fullWidth
                  size="large"
                  variant="contained"
                  color="secondary"
                  onClick={updateProfileData}
                >
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

ProfileData.propTypes = {
  isLoading: PropTypes.bool
};

export default ProfileData;

