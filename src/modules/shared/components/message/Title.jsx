import PropTypes from 'prop-types';
// material-ui
import { styled } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
// project imports
import MainCard from 'modules/shared/components/cards/MainCard';
// assets
import defaultImg from 'assets/images/profile/profile-picture-6.jpg';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: theme.palette.secondary.light,
  overflow: 'hidden',
  position: 'relative'
}));

const Title = ({ message, submessage, avatar }) => {
  return (
    <CardWrapper border={false} content={false}>
      <Box sx={{ p: 2 }}>
        <List sx={{ py: 0 }}>
          <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
            <ListItemAvatar>
              <Avatar
                variant="rounded"
                sx={{
                  color: '#fff',
                  borderRadius: '50%',
                  background: 'transparent',
                  width: 60,
                  height: 60
                }}
              >
                <img id="profile-pic" style={{ width: 50, height: 50, borderRadius: '50%' }} src={avatar || defaultImg} alt="Avatar user" />
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
                <Typography
                  sx={{ fontSize: '0.8rem', fontWeight: 'normal', mr: 1, mt: 1.75, mb: 0.75, textAlign: 'center', color: '#FFF' }}
                >
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

Title.propTypes = {
  message: PropTypes.string,
  submessage: PropTypes.string,
  avatar: PropTypes.string
};

export default Title;

