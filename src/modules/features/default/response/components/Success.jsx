/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Button, Grid, Typography } from '@mui/material';
import { genConst } from 'store/constant';
import { IconCircleCheck } from '@tabler/icons';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';
import { processPaymentSuccess, validateOrder } from '../services/responseService';

const Success = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');
  const status = searchParams.get('status');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  let navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName);
        setUserEmail(user.email);
      }
    });

    // Validar la orden usando el servicio
    if (!validateOrder(orderId)) {
      console.log('No Id yet');
      navigate('/app/dashboard');
    } else {
      console.log('Id: ', orderId, status);
      // Procesar el pago exitoso usando el servicio
      processPaymentSuccess(orderId, status, userId, userName, userEmail);
    }
  }, [orderId, status, userId, userName, userEmail, navigate]);

  const handleReturn = () => {
    navigate('/app/dashboard');
  };

  return (
    <Box sx={{ mt: 25 }}>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          <center>
            <IconCircleCheck size={100} color={genConst.CONST_CREATE_COLOR} />
            <Typography variant="h3" color="secondary">
              Tu compra se ha realizado con éxito!
            </Typography>
            {status ? (
              <Typography variant="h4" color="secondary">
                {status}
              </Typography>
            ) : (
              <></>
            )}
          </center>
        </Grid>
        <Grid item xs={12}>
          <center>
            <Button
              variant="contained"
              size="large"
              style={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF' }}
              onClick={handleReturn}
            >
              Regresar
            </Button>
          </center>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Success;