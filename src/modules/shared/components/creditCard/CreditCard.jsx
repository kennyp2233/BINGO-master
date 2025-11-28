/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';

// material-ui
import { useTheme } from '@mui/material/styles';
import { FormControl, Grid, InputLabel, OutlinedInput, Button, Typography, Modal, CircularProgress } from '@mui/material';

//Assets
import { genConst } from 'store/constant';
import { generateId } from 'utils/idGenerator';
import { updateDocument } from 'config/firebaseEvents';
import { collSubscription } from 'store/collections';
import { useUsersId } from 'hooks/useUserId';
import { endDateWithParam, initDate } from 'utils/validations';
import { Box } from '@mui/system';

const CreditCard = (props) => {
  const { total, type } = props;
  let navigate = useNavigate();
  const theme = useTheme();
  const userId = useUsersId();
  const [searchParams] = useSearchParams();
  const param1 = searchParams.get('param1');
  const param2 = searchParams.get('param2');
  const param3 = searchParams.get('param3');
  const param4 = searchParams.get('param4');
  const [isChecked, setIsChecked] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    focus: ''
  });

  const checkHandler = () => {
    setIsChecked(!isChecked);
  };

  const handleInputFocus = (e) => {
    setCardDetails({ ...cardDetails, focus: e.target.name });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handlePayment = () => {
    if (isChecked) {
      const object = {
        id: generateId(10),
        idUser: null,
        name: param1 + ' ' + param2,
        email: param3,
        idCourse: param4,
        cardDetails: cardDetails
      };
      console.log(object);
    } else {
      console.log('Procesar Pago');
      setOpen(true);
      const tp = type == 1 ? genConst.CONST_MONTH_DAYS : genConst.CONST_YEAR_DAYS;
      const obj = {
        startDate: initDate(),
        endDate: endDateWithParam(tp),
        state: genConst.CONST_SUB_STATE_ACTIVE,
        totalDays: tp
      };
      updateDocument(collSubscription, userId, obj);
      setTimeout(() => {
        setOpen(false);
        navigate('/app/dashboard');
        window.location.reload();
      }, 3000);
    }
  };

  return (
    <>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={6} lg={6}>
          <Cards
            number={cardDetails.number}
            name={cardDetails.name}
            expiry={cardDetails.expiry}
            cvc={cardDetails.cvc}
            focused={cardDetails.focus}
            placeholders={{ name: 'Tu Nombre aquí' }}
            locale={{ valid: 'Caducidad' }}
            preview={true}
          />
          <Typography variant="h4" sx={{ mt: 2 }}>
            {'Suscripción: '}
            {type == 1 ? <span style={{ fontWeight: 'normal' }}>Mensual</span> : <span style={{ fontWeight: 'normal' }}>Anual</span>}
          </Typography>
          <Typography variant="h4" sx={{ mt: 2 }}>
            {'Total a Pagar: '}
            <span style={{ fontWeight: 'normal' }}>$ {total}</span>
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
                  type="password"
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
            <Grid item xs={12}>
              <input type="checkbox" id="checkbox" checked={isChecked} onChange={checkHandler} />
              <label htmlFor="checkbox" style={{ marginLeft: 5 }}>
                Guardar datos para futuros pagos.
              </label>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                style={{ margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_CREATE_COLOR }}
                onClick={handlePayment}
              >
                Pagar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <center>
          <Box sx={style}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 80,
  height: 80,
  bgcolor: 'transparent',
  border: 'none',
  borderRadius: 6,
  boxShadow: 0,
  p: 4
};

export default CreditCard;
