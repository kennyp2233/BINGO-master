import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-credit-cards/es/styles-compiled.css';

// material-ui
import { Button, Grid, Typography } from '@mui/material';

// project imports
import AuthWrapper from '../login/AuthWrapper';
import AuthCardWrapper from '../login/AuthCardWrapper';
import AuthFooter from 'modules/shared/components/cards/AuthFooter';

// Firebase
import { authentication } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

//Assets
import bg01 from 'assets/images/bg/bg4.jpg';
import { genConst } from 'store/constant';
import notFound from 'assets/images/error/notfound.jpg';

const NotFound = () => {
  let navigate = useNavigate();
  const handleReturn = () => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        navigate('/app/dashboard');
      } else {
        navigate('/');
      }
    });
  };
  return (
    <AuthWrapper
      style={{
        backgroundImage: `url(${bg01})`,
        width: '100%',
        height: '100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
    >
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item xs={12}>
                    <center>
                      <img src={notFound} alt="NotFoundPage" width="300" />
                      <Typography variant="h2" color="secondary">
                        Ups! La página que buscas no existe!
                      </Typography>
                    </center>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      style={{ margin: 5, borderRadius: 10, backgroundColor: genConst.CONST_CREATE_COLOR }}
                      onClick={handleReturn}
                    >
                      Regresar
                    </Button>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default NotFound;

