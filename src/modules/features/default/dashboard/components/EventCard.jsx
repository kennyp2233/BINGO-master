import PropTypes from 'prop-types';
import { useNavigate, createSearchParams, useLocation } from 'react-router-dom';
// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Button, ButtonGroup, Grid, Typography } from '@mui/material';
// project imports
import MainCard from 'modules/shared/components/cards/MainCard';
import { useAuth } from 'modules/features/auth/hooks/useAuth';
// assets
import { IconCalendar, IconFileDollar, IconPlayCard } from '@tabler/icons';

const EventCard = ({ name, date, bg, id, transmition, state }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggin } = useAuth();

    const CardWrapper = styled(MainCard)({
        backgroundColor: bg,
        color: '#fff',
        overflow: 'hidden',
        position: 'relative'
    });

    const buttonStyles = {
        background: '#FFF',
        color: '#00adef',
        '&:hover': {
            backgroundColor: '#00adef',
            color: '#FFF'
        }
    };

    const handleNavigation = (path, params) => {
        // Si el usuario no está autenticado, redirigir a login
        if (!isLoggin) {
            navigate('/auth/signin', {
                state: { from: location.pathname, eventData: { path, params } }
            });
            return;
        }

        navigate({
            pathname: path,
            search: createSearchParams(params).toString()
        });
    };

    return (
        <CardWrapper border={false} content={false}>
            <Box sx={{ p: 2 }}>
                <Grid container direction="column">
                    <Grid item>
                        <Grid container alignItems="center">
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
                            <Typography sx={{ fontSize: '1.2rem', fontWeight: 500, ml: 2, mt: 1.75, color: '#FFF' }}>{name}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography textAlign="center" sx={{ fontSize: '0.9rem', fontWeight: 500, mt: 1, color: '#FFF' }}>
                            Fecha evento: {date}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <ButtonGroup fullWidth sx={{ mt: 1 }}>
                            <Button
                                variant="contained"
                                size="large"
                                sx={buttonStyles}
                                onClick={() => handleNavigation('/app/card-selector', { id, name, date, transmition })}
                                startIcon={<IconFileDollar />}
                            >
                                <span style={{ fontSize: 10 }}>COMPRAR</span>
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                sx={buttonStyles}
                                disabled={!state}
                                onClick={() => handleNavigation('/app/play-bingo', { id, name, date, transmition })}
                                startIcon={<IconPlayCard />}
                            >
                                <span style={{ fontSize: 10 }}>JUGAR</span>
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </Box>
        </CardWrapper>
    );
};

EventCard.propTypes = {
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    bg: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    transmition: PropTypes.string,
    state: PropTypes.number.isRequired
};

export default EventCard;
