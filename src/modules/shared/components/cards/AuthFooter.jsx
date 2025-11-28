// material-ui
import { Link, Typography, Stack } from '@mui/material';

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between" style={{ bottom: 0, display: 'flex' }}>
    <Typography variant="subtitle1" underline="hover" style={{ color: 'white' }}>
      Alcorp Tech 2024
    </Typography>
    <Typography
      variant="subtitle1"
      component={Link}
      href="https://alcorp.tech"
      target="_blank"
      underline="hover"
      style={{ marginLeft: 20, color: 'white' }}
    >
      Powered by &copy; alcorp.tech
    </Typography>
  </Stack>
);

export default AuthFooter;
