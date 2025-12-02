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
import { collUserPhone } from 'store/collections';
import { fullDate } from 'modules/shared/utils/validations';

const CardWrapper = styled(MainCard)(() => ({
  backgroundColor: '#414551',
  color: '#fff',
  overflow: 'hidden',
  position: 'relative'
}));

const UserPhone = () => {
  const theme = useTheme();
  const [id, setId] = React.useState(null);
  const [phone, setPhone] = React.useState(null);

  useEffect(() => {
    onAuthStateChanged(authentication, async (user) => {
      if (user) {
        setId(user.uid);
        const q = query(collection(db, collUserPhone), where('idUser', '==', user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setPhone(doc.data().phone);
        });
      }
    });
  }, []);

  const updateProfileData = () => {
    if (!phone) {
      toast.info('Teléfono es requerido!', { position: toast.POSITION.TOP_RIGHT });
    } else {
      updateDoc(doc(db, collUserPhone, id), {
        phone: phone,
        updateAt: fullDate()
      });
      toast.success('Teléfono actualizado correctamente!', { position: toast.POSITION.TOP_RIGHT });
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
                    Teléfono
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
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

UserPhone.propTypes = {
  isLoading: PropTypes.bool
};

export default UserPhone;

