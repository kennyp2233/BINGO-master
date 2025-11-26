import { Grid, Box, CircularProgress, ButtonBase, Typography } from '@mui/material';
import { IconCheck } from '@tabler/icons';

const CardGrid = ({ cards, loading, checkingAvailability, isCardSelected, handleSelect, theme }) => {
    return (
        <Box sx={{ width: '100%', p: 2 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress size={60} thickness={4} sx={{ color: '#00adef' }} />
                </Box>
            ) : (
                <Grid container spacing={1.5}>
                    {cards.map((item) => {
                        const isAvailable = item.state === 1 || item.state === 2;
                        const selected = isCardSelected(item.id);

                        return (
                            <Grid key={item.id} item xs={4} sm={3} md={2} lg={1.5}>
                                <ButtonBase
                                    disabled={!isAvailable || checkingAvailability}
                                    onClick={() => handleSelect(item)}
                                    sx={{
                                        width: '100%',
                                        borderRadius: 2,
                                        position: 'relative',
                                        transition: 'all 0.2s',
                                        transform: selected ? 'scale(1.05)' : 'scale(1)',
                                        opacity: isAvailable ? 1 : 0.4
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '100%',
                                            aspectRatio: '1/1',
                                            bgcolor: selected ? theme.palette.primary.main : theme.palette.background.paper,
                                            border: selected ? `2px solid ${theme.palette.common.white}` : `1px solid ${theme.palette.divider}`,
                                            borderRadius: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: theme.palette.text.primary,
                                            boxShadow: selected ? theme.shadows[4] : 'none',
                                            '&:hover': {
                                                bgcolor: selected ? theme.palette.primary.dark : theme.palette.action.hover,
                                                borderColor: selected ? theme.palette.common.white : theme.palette.primary.main
                                            }
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: selected ? '#fff' : 'inherit' }}>
                                            {item.order}
                                        </Typography>
                                        {selected && (
                                            <IconCheck size={18} style={{ position: 'absolute', top: 6, right: 6, color: '#fff' }} />
                                        )}
                                    </Box>
                                </ButtonBase>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
};

export default CardGrid;
