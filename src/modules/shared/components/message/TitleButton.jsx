import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// material-ui
import { styled } from '@mui/material/styles';
import { Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
// project imports
import MainCard from 'modules/shared/components/cards/MainCard';
// assets
import defaultImg from 'assets/images/profile/profile-picture-6.jpg';
import { IconArrowLeft } from '@tabler/icons';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: theme.palette.secondary.light,
  overflow: 'hidden',
  position: 'relative'
}));

const TitleButton = ({ message, submessage, avatar, route }) => {
  let navigate = useNavigate();
  return (
    <CardWrapper border={false} content={false}>
      <Box sx={{ p: 2 }}>
        <List sx={{ py: 0 }}>
          <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
            <ListItemAvatar>
              <Button onClick={() => navigate(route)}>
                <IconArrowLeft color="#FFF" size={30} />
              </Button>
            </ListItemAvatar>
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

TitleButton.propTypes = {
  message: PropTypes.string,
  submessage: PropTypes.string,
  avatar: PropTypes.string,
  route: PropTypes.string
};

export default TitleButton;

