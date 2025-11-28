import PropTypes from 'prop-types';

// material-ui
import { Box } from '@mui/material';

// project import
import MainCard from 'modules/shared/components/cards/MainCard';

// ==============================|| AUTHENTICATION CARD WRAPPER ||============================== //

const AuthCardWrapperMid = ({ children, ...other }) => (
  <MainCard
    sx={{
      width: { xs: 500, lg: 600 },
      margin: { xs: 2.5, md: 3 },
      '& > *': {
        flexGrow: 1,
        flexBasis: '50%'
      }
    }}
    content={false}
    {...other}
  >
    <Box sx={{ p: { xs: 2, sm: 3, xl: 5 } }}>{children}</Box>
  </MainCard>
);

AuthCardWrapperMid.propTypes = {
  children: PropTypes.node
};

export default AuthCardWrapperMid;

