import { Link } from 'react-router-dom';

import { Typography } from '@mui/material';
import logo from 'assets/images/LogoBingo.png';

const Logo = () => {
  return (
    <Typography component={Link} to="/">
      <img src={logo} alt="Logo Principal" width="160" />
    </Typography>
  );
};

export default Logo;
