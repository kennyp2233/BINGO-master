import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

// project imports
import MainCard from 'modules/shared/components/cards/MainCard';

// assets
import { IconMessage } from '@tabler/icons';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: theme.palette.secondary.light,
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: '#90caf9',
    borderRadius: '50%',
    top: -30,
    right: -180
  }
}));

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

const MessageDark = ({ message, submessage }) => {
  const theme = useTheme();

  return (
    <CardWrapper border={false} content={false}>
      <Box sx={{ pl: 1 }}>
        <List sx={{ py: 0 }}>
          <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
            <ListItemAvatar>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.largeAvatar,
                  backgroundColor: theme.palette.secondary.light[700],
                  color: '#fff'
                }}
              >
                <IconMessage />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{
                py: 0,
                mt: 0.1,
                mb: 0.1
              }}
              primary={
                <Typography sx={{ fontSize: '1rem', fontWeight: 500, mr: 1, mt: 2, mb: 1, textAlign: 'center', color: '#FFF' }}>
                  {message}
                </Typography>
              }
              secondary={
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 400, mr: 0, mt: 1.75, mb: 1, textAlign: 'center', color: '#FFF' }}>
                  {submessage}
                </Typography>
              }
            />
          </ListItem>
        </List>
      </Box>
    </CardWrapper>
  );
};

MessageDark.propTypes = {
  message: PropTypes.string,
  submessage: PropTypes.string
};

export default MessageDark;

