import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

// project imports
import MainCard from 'modules/shared/components/cards/MainCard';

// assets
import { IconMessage } from '@tabler/icons';
import { Link } from 'react-router-dom';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: '#9f98c2',
  color: theme.palette.secondary.light,
  overflow: 'hidden',
  position: 'relative'
}));

const SubscreptionState = ({ message, submessage }) => {
  const theme = useTheme();

  return (
    <CardWrapper border={false} content={false}>
      <Box sx={{ p: 2 }}>
        <List sx={{ py: 0 }}>
          <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
            <ListItemAvatar>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.largeAvatar,
                  backgroundColor: '#53338a',
                  color: '#FFF'
                }}
              >
                <IconMessage />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{
                py: 0,
                mt: 0.45,
                mb: 0.45
              }}
              primary={
                <Typography sx={{ fontSize: '1.255rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75, textAlign: 'center', color: '#FFF' }}>
                  {message}
                </Typography>
              }
              secondary={
                <Typography sx={{ fontSize: '0.975rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75, textAlign: 'center', color: '#FFF' }}>
                  {submessage}
                </Typography>
              }
            />
          </ListItem>
          <center>
            <Typography component={Link} to="/app/subscription">
              <Button variant="outlined" size="large">
                <Typography sx={{ fontSize: '0.975rem', fontWeight: 500, textAlign: 'center', color: '#FFF' }}>EMPEZAR</Typography>
              </Button>
            </Typography>
          </center>
        </List>
      </Box>
    </CardWrapper>
  );
};

SubscreptionState.propTypes = {
  message: PropTypes.string,
  submessage: PropTypes.string
};

export default SubscreptionState;

