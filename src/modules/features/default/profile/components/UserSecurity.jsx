import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import ProfileChangeEmail from './ProfileChangeEmail';
import ProfileChangePassword from './ProfileChangePassword';

import { gridSpacing } from 'store/constant';

// Firebase
import { authentication } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const UserSecurity = () => {
  const [id, setId] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        setId(user.uid);
        setEmail(user.email);
      }
    });
  }, []);

  return (
    <Box sx={{ width: '100%', height: '100%', backgroundColor: '#FFF', borderRadius: 4, padding: 2 }}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <ProfileChangeEmail email={email} id={id} />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <ProfileChangePassword email={email} id={id} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserSecurity;