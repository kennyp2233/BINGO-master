import React from 'react';
import { Grid, Typography } from '@mui/material';

function StateTickets() {
  return (
    <div>
      <div style={{ margin: 10 }}>
        <center>
          <Grid container spacing={0.3}>
            <Grid item lg={4} md={4} sm={4}>
              <Grid container spacing={0.3}>
                <Grid item lg={3} md={3} sm={3}>
                  <div style={{ width: 20, height: 10, backgroundColor: '#00adef', borderRadius: 5 }}></div>
                </Grid>
                <Grid item lg={3} md={3} sm={3}>
                  <div style={{ width: 20, height: 10, backgroundColor: 'green', borderRadius: 5 }}></div>
                </Grid>
                <Grid item lg={3} md={3} sm={3}>
                  <div style={{ width: 20, height: 10, backgroundColor: '#525252', borderRadius: 5 }}></div>
                </Grid>
                <Grid item lg={3} md={3} sm={3}>
                  <div style={{ width: 20, height: 10, backgroundColor: '#ff6b35', borderRadius: 5 }}></div>
                </Grid>
                <Grid item lg={3} md={3} sm={3}>
                  <Typography id="modal-modal-title" variant="h6" component="h6" align="center" color={'#000'}>
                    Disponible
                  </Typography>
                </Grid>
                <Grid item lg={3} md={3} sm={3}>
                  <Typography id="modal-modal-title" variant="h6" component="h6" align="center" color={'#000'}>
                    Seleccionada
                  </Typography>
                </Grid>
                <Grid item lg={3} md={3} sm={3}>
                  <Typography id="modal-modal-title" variant="h6" component="h6" align="center" color={'#000'}>
                    Asignada
                  </Typography>
                </Grid>
                <Grid item lg={3} md={3} sm={3}>
                  <Typography id="modal-modal-title" variant="h6" component="h6" align="center" color={'#000'}>
                    Devuelta
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </center>
      </div>
    </div>
  );
}

export default StateTickets;
