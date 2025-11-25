import PropTypes from 'prop-types';
// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';
// project imports
import MainCard from 'components/cards/MainCard';
// assets
import { IconCalendar } from '@tabler/icons';

const EventCard = ({ name, date, bg }) => {
  const theme = useTheme();
  const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: bg,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 210,
      height: 210,
      background: 'rgba(255,255,255,0.7)',
      borderRadius: '50%',
      top: -85,
      right: -95,
      [theme.breakpoints.down('sm')]: {
        top: -105,
        right: -140
      }
    }
  }));
  return (
    <CardWrapper border={false} content={false}>
      <Box sx={{ p: 2 }}>
        <Grid container direction="column">
          <Grid item>
            <Grid container>
              <Grid item lg={2}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.largeAvatar,
                    backgroundColor: '#FFF',
                    mt: 1
                  }}
                >
                  <IconCalendar />
                </Avatar>
              </Grid>
              <Grid item lg={10}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 500, ml: 2, mr: 1, mt: 1.75, mb: 0.75, color: '#FFF' }}>{name}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, mr: 2, mt: 1, mb: 0.75, color: '#FFF' }}>{date}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </CardWrapper>
  );
};

EventCard.propTypes = {
  name: PropTypes.string,
  date: PropTypes.string,
  bg: PropTypes.string,
  id: PropTypes.string,
  transmition: PropTypes.string
};

export default EventCard;
