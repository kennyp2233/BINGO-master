import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Box,
    Typography,
    CircularProgress,
    ButtonBase,
    Pagination,
    Stack,
    useTheme,
    Chip,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import { getGameCardsByEventPaginated, checkCardAvailability } from 'modules/features/admin/cards';
import { toast } from 'react-toastify';
import { IconCheck } from '@tabler/icons';

const QuickSelectModal = ({ open, onClose, eventId, eventName, onBuySelection }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [filterState, setFilterState] = useState(null); // null = All, 1 = Available
    const rowsPerPage = 24;

    useEffect(() => {
        if (open && eventId) {
            fetchCards();
        }
    }, [open, eventId, page, filterState]);

    const fetchCards = async () => {
        setLoading(true);
        try {
            const { cards: fetchedCards, totalCount } = await getGameCardsByEventPaginated(eventId, page, rowsPerPage, filterState);
            setCards(fetchedCards);
            setTotalPages(Math.ceil(totalCount / rowsPerPage));
        } catch (error) {
            console.error('Error fetching cards:', error);
            toast.error('Error al cargar las cartillas');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage - 1);
    };

    const handleFilterChange = (event, newFilter) => {
        if (newFilter !== null) {
            setFilterState(newFilter === 'all' ? null : 1);
            setPage(0); // Reset page when filter changes
        }
    };

    const handleSelect = async (item) => {
        if (selectedItems.some((selected) => selected.id === item.id)) {
            setSelectedItems(selectedItems.filter((selected) => selected.id !== item.id));
            return;
        }

        try {
            const { available } = await checkCardAvailability(item.id);
            if (available) {
                setSelectedItems([...selectedItems, item]);
            } else {
                toast.warning('Cartilla no disponible');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const isSelected = (id) => selectedItems.some(item => item.id === id);
    const totalPrice = selectedItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`
                }
            }}
        >
            <DialogTitle sx={{ borderBottom: '1px solid #2C3038', pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            Selecciona tus Cartillas
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            Evento: <span style={{ color: theme.palette.text.primary }}>{eventName}</span>
                        </Typography>
                    </Box>
                    <Chip
                        label={`${selectedItems.length} seleccionadas`}
                        color="primary"
                        variant={selectedItems.length > 0 ? "filled" : "outlined"}
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ToggleButtonGroup
                        value={filterState === null ? 'all' : 'available'}
                        exclusive
                        onChange={handleFilterChange}
                        size="small"
                        sx={{
                            '& .MuiToggleButton-root': {
                                color: theme.palette.text.secondary,
                                borderColor: theme.palette.divider,
                                '&.Mui-selected': {
                                    color: '#fff',
                                    bgcolor: theme.palette.primary.main,
                                    '&:hover': {
                                        bgcolor: theme.palette.primary.dark,
                                    }
                                }
                            }
                        }}
                    >
                        <ToggleButton value="all">Todas</ToggleButton>
                        <ToggleButton value="available">Disponibles</ToggleButton>
                    </ToggleButtonGroup>

                    <Box sx={{ p: 1, bgcolor: `${theme.palette.primary.main}14`, borderRadius: 2, border: `1px dashed ${theme.palette.primary.main}4D` }}>
                        <Typography variant="caption" sx={{ color: theme.palette.primary.main, display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: theme.palette.divider, border: `1px solid ${theme.palette.action.disabled}` }} /> Disponible
                            </Box>
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: theme.palette.primary.main }} /> Seleccionado
                            </Box>
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ minHeight: '300px', p: 3 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress size={40} thickness={4} sx={{ color: '#00adef' }} />
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={1.5}>
                            {cards.map((item) => {
                                const isAvailable = item.state === 1 || item.state === 2;
                                const selected = isSelected(item.id);
                                return (
                                    <Grid key={item.id} item xs={3} sm={2} md={1.5}>
                                        <ButtonBase
                                            disabled={!isAvailable}
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
                                                    bgcolor: selected ? theme.palette.primary.main : theme.palette.background.default,
                                                    border: selected ? `2px solid ${theme.palette.common.white}` : `1px solid ${theme.palette.divider}`,
                                                    borderRadius: 2,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: theme.palette.text.primary,
                                                    '&:hover': {
                                                        bgcolor: selected ? theme.palette.primary.dark : theme.palette.action.hover,
                                                        borderColor: selected ? theme.palette.common.white : theme.palette.primary.main
                                                    }
                                                }}
                                            >
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                    {item.order}
                                                </Typography>
                                                {selected && (
                                                    <IconCheck size={16} style={{ position: 'absolute', top: 4, right: 4 }} />
                                                )}
                                            </Box>
                                        </ButtonBase>
                                    </Grid>
                                );
                            })}
                        </Grid>

                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination
                                    count={totalPages}
                                    page={page + 1}
                                    onChange={handlePageChange}
                                    color="primary"
                                    shape="rounded"
                                    sx={{
                                        '& .MuiPaginationItem-root': { color: theme.palette.text.primary, borderColor: theme.palette.divider },
                                        '& .Mui-selected': { bgcolor: `${theme.palette.primary.main} !important`, fontWeight: 'bold' }
                                    }}
                                />
                            </Box>
                        )}
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ borderTop: '1px solid #2C3038', p: 2, justifyContent: 'space-between' }}>
                <Box sx={{ pl: 1 }}>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>Total estimado</Typography>
                    <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
                        ${totalPrice.toFixed(2)}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={onClose} sx={{ color: '#A0A4AB', '&:hover': { color: '#fff' } }}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => onBuySelection(selectedItems)}
                        disabled={selectedItems.length === 0}
                        sx={{
                            bgcolor: theme.palette.primary.main,
                            px: 3,
                            '&:hover': { bgcolor: theme.palette.primary.dark },
                            '&.Mui-disabled': { bgcolor: theme.palette.action.disabledBackground }
                        }}
                    >
                        Confirmar Compra
                    </Button>
                </Box>
            </DialogActions>
        </Dialog >
    );
};

QuickSelectModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    eventId: PropTypes.string,
    eventName: PropTypes.string,
    onBuySelection: PropTypes.func.isRequired
};

export default QuickSelectModal;
