/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import 'react-credit-cards/es/styles-compiled.css';
import { Box, Button, Grid, Typography } from '@mui/material';
import { genConst } from 'store/constant';
import { IconCircleX } from '@tabler/icons';
import { processPaymentFailure, validateOrder } from '../services/responseService';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';

const Failure = () => {
  const [searchParams] = useSearchParams();
  const order = searchParams.get('order');
  const status = searchParams.get('status');
  const [userId, setUserId] = useState('');
  let navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    // Validar la orden usando el servicio
    if (!validateOrder(order)) {
      console.log('No Id yet');
    } else {
      console.log('Id: ', order, status);
      // Procesar el pago fallido usando el servicio
      processPaymentFailure(order, status || 'Error desconocido', userId);
    }
  }, [order, status, userId]);

  const handleReturn = () => {
    navigate('/app/dashboard');
  };

  return (
    <Box sx={{ mt: 25 }}>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          <center>
            <IconCircleX size={100} color={genConst.CONST_DELETE_COLOR} />
            <Typography variant="h3" color={genConst.CONST_DELETE_COLOR}>
              Tu compra no pudo ser procesada correctamente!
            </Typography>
            {status ? (
              <Typography variant="h4" color={genConst.CONST_DELETE_COLOR}>
                {status === null ? '' : status}
              </Typography>
            ) : (
              <></>
            )}
          </center>
        </Grid>
        <Grid item xs={12}>
          <center>
            <Button
              variant="outlined"
              size="large"
              style={{ margin: 5, borderRadius: 10, borderColor: genConst.CONST_DELETE_COLOR, color: genConst.CONST_DELETE_COLOR }}
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

export default Failure;