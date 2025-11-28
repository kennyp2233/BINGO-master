import React, { useState } from 'react';
//import { useSearchParams } from 'react-router-dom';

// material-ui
import {
  Box,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button
} from '@mui/material';

import CreditCards from '../inscription/CreditCards';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import Logo from 'modules/shared/components/Logo-md';
import AuthFooter from 'modules/shared/components/cards/AuthFooter';
import { genConst } from 'store/constant';

// assets
import bg01 from 'assets/images/05.webp';
import AuthCardWrapperMid from '../AuthCardWrapperMid';
import { endDateWithParam, initDate } from 'utils/validations';
//import PaymentMethods from '../inscription/PaymentMethods';

const Subscription = () => {
  //const [searchParams] = useSearchParams();
  //const id = searchParams.get('id');
  const [type, setType] = useState(null);
  const [method, setMethod] = useState(null);
  const [isType, setIsType] = useState(false);
  //TOTAL PARAMS
  const [total, setTotal] = useState(null);
  const [iva, setIva] = useState(null);
  const [subtotal, setSubtotal] = useState(null);

  //DATE PARAMS
  const [startDate] = useState(initDate());
  const [endDate, setEndDate] = useState(null);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleRadioChange = (event) => {
    setType(event.target.value);
    if (event.target.value == 1) {
      setIsType(true);
      setType(1);
      let ivaValue = genConst.CONST_MONTH_VALUE * genConst.CONST_IVA;
      let ivaRound = Math.round(ivaValue * 10 ** 2) / 10 ** 2;
      let totalValue = genConst.CONST_MONTH_VALUE - ivaRound;
      setIva(ivaRound);
      setSubtotal(totalValue);
      setTotal(genConst.CONST_MONTH_VALUE);
      setEndDate(endDateWithParam(genConst.CONST_MONTH_DAYS));
    } else if (event.target.value == 2) {
      setIsType(true);
      setType(2);
      let ivaValue = genConst.CONST_YEAR_VALUE * genConst.CONST_IVA;
      let totalValue = genConst.CONST_YEAR_VALUE - ivaValue;
      setIva(ivaValue);
      setSubtotal(totalValue);
      setTotal(genConst.CONST_YEAR_VALUE);
      setEndDate(endDateWithParam(genConst.CONST_YEAR_DAYS));
    }
  };

  const handleMethodChange = (event) => {
    setMethod(event.target.value);
  };

  return (
    <AuthWrapper1
      style={{
        backgroundImage: `url(${bg01})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        margin: 0,
        padding: 0
      }}
    >
      <Grid container direction="column">
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 57px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapperMid>
                <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ marginBottom: 10 }}>
                  <Grid item>
                    <Logo />
                  </Grid>
                </Grid>
                <center></center>
                <Grid container justifyContent="center" alignItems="center">
                  <Grid item lg={12}>
                    <Box sx={{ maxWidth: 600 }}>
                      <Stepper activeStep={activeStep} orientation="vertical">
                        <Step key={1}>
                          <StepLabel>{'Selecciona tu Suscripción'}</StepLabel>
                          <StepContent>
                            <Typography>{'Si realizas el pago anual, recibes un descuento de dos meses.'}</Typography>
                            <center>
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-labelledby="demo-row-radio-buttons-group-label"
                                  name="row-radio-buttons-group"
                                  onChange={handleRadioChange}
                                  values={type}
                                >
                                  <FormControlLabel value={1} control={<Radio />} label="Mensual $30" />
                                  <FormControlLabel value={2} control={<Radio />} label="Anual $300" />
                                </RadioGroup>
                              </FormControl>
                            </center>
                            {isType ? (
                              <center>
                                <Grid container style={{ marginTop: 20 }}>
                                  <Grid xs={6}>
                                    <Typography variant={'h5'} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                      Fecha Inicio:
                                    </Typography>
                                  </Grid>
                                  <Grid xs={6}>
                                    <Typography variant={'h5'} style={{ textAlign: 'left', marginLeft: 20 }}>
                                      {startDate}
                                    </Typography>
                                  </Grid>
                                  <Grid xs={6}>
                                    <Typography variant={'h5'} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                      Fecha Fin:
                                    </Typography>
                                  </Grid>
                                  <Grid xs={6}>
                                    <Typography variant={'h5'} style={{ textAlign: 'left', marginLeft: 20 }}>
                                      {endDate}
                                    </Typography>
                                  </Grid>
                                  <Grid xs={6}>
                                    <Typography variant={'h5'} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                      Subtotal:
                                    </Typography>
                                  </Grid>
                                  <Grid xs={6}>
                                    <Typography variant={'h5'} style={{ textAlign: 'left', marginLeft: 20 }}>
                                      $ {subtotal}
                                    </Typography>
                                  </Grid>
                                  <Grid xs={6}>
                                    <Typography variant={'h5'} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                      IVA:
                                    </Typography>
                                  </Grid>
                                  <Grid xs={6}>
                                    <Typography variant={'h5'} style={{ textAlign: 'left', marginLeft: 20 }}>
                                      $ {iva}
                                    </Typography>
                                  </Grid>
                                  <Grid xs={6}>
                                    <Typography variant={'h5'} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                      Total:
                                    </Typography>
                                  </Grid>
                                  <Grid xs={6}>
                                    <Typography variant={'h5'} style={{ textAlign: 'left', marginLeft: 20 }}>
                                      $ {total}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </center>
                            ) : (
                              <></>
                            )}
                            <Box sx={{ mb: 2 }}>
                              <center>
                                <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                                  {'Continuar'}
                                </Button>
                              </center>
                            </Box>
                          </StepContent>
                        </Step>
                        <Step key={2}>
                          <StepLabel>{'Selecciona tu Forma de Pago'}</StepLabel>
                          <StepContent>
                            <center>
                              <FormControl>
                                <RadioGroup
                                  aria-labelledby="demo-radio-buttons-group-label"
                                  name="radio-buttons-group"
                                  onChange={handleMethodChange}
                                  values={type}
                                >
                                  <FormControlLabel value={1} control={<Radio />} label="Tarjeta de Crédito" />
                                  <FormControlLabel value={2} control={<Radio />} label="Deposito o Transferencia" />
                                  <FormControlLabel value={3} control={<Radio />} label="Paypal" />
                                  <FormControlLabel value={4} control={<Radio />} label="Realizar el pago despúes" />
                                </RadioGroup>
                              </FormControl>
                            </center>
                            <Box sx={{ mb: 2 }}>
                              <center>
                                <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                                  {'Continuar'}
                                </Button>
                                <Button disabled={0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                                  Regresar
                                </Button>
                              </center>
                            </Box>
                          </StepContent>
                        </Step>
                        <Step key={3}>
                          <StepLabel>{'Realiza el Pago'}</StepLabel>
                          <StepContent>
                            {method == 1 ? (
                              <CreditCards />
                            ) : method == 2 ? (
                              <h4>Deposito</h4>
                            ) : method == 3 ? (
                              <h4>Paypal</h4>
                            ) : (
                              <h4>Pago despues</h4>
                            )}
                            <Box sx={{ mb: 2 }}>
                              <center>
                                <Button disabled={0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                                  Regresar
                                </Button>
                              </center>
                            </Box>
                          </StepContent>
                        </Step>
                      </Stepper>
                    </Box>
                  </Grid>
                </Grid>
              </AuthCardWrapperMid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Subscription;

