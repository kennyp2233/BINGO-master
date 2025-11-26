import { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Modal, Typography } from '@mui/material';
import MessageDark from 'components/message/MessageDark';
import CircularProgress from '@mui/material/CircularProgress';
import { getGameCardsByEventPaginated, checkCardAvailability, clearCardsPaginationCache } from 'modules/features/admin/cards';
import { checkTermsAccepted, acceptTerms } from '../../services/termsService';
import { calculateTaxes } from '../../services/taxService';
import { canProceedWithPayment } from '../../services/validationService';
import { uiStyles } from '../styles';
//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';
import StateTickets from 'components/StateTickets';
import BingoCard from 'components/bingo/BingoCard';
import CustomModal from 'components/Modal';
import TermsModal from '../TermsModal';

// Sub-components
import CardGrid from './CardGrid';
import CardSummary from './CardSummary';
import CardPagination from './CardPagination';
import EmptyState from './EmptyState';

const CardSelector = () => {
    //let navigate = useNavigate();
    const theme = useTheme();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Obtener params de URL o del state de navegación (redirección post-login)
    const getParam = (key) => {
        return searchParams.get(key) || location.state?.eventData?.params?.[key];
    };

    const id = getParam('id');
    const [cards, setCards] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCard, setOpenCard] = useState(false);
    const [cardN, setCardN] = useState('');
    const [bingoNumbers, setBingoNumbers] = useState({ bN: [], iN: [], nN: [], gN: [], oN: [] });
    const [openLoader, setOpenLoader] = useState(false);

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [totalPages, setTotalPages] = useState(0);

    // User info
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [name, setName] = useState('');
    const [date, setDate] = useState('');

    // Terms and conditions
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [openTermsModal, setOpenTermsModal] = useState(false);

    // Availability check
    const [checkingAvailability, setCheckingAvailability] = useState(false);

    useEffect(() => {
        onAuthStateChanged(authentication, async (user) => {
            if (user) {
                setUserId(user.uid);
                setUserName(user.displayName);
                setName('Hola, ' + user.displayName);
                const today = new Date();
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                setDate(today.toLocaleDateString('es-ES', options));

                // Check if user has already accepted terms
                const accepted = await checkTermsAccepted();
                setTermsAccepted(accepted);
            }
        });
    }, []);

    useEffect(() => {
        const fetchCards = async () => {
            if (id) {
                setLoading(true);
                try {
                    // Usar la nueva función paginada
                    const { cards: fetchedCards, totalCount } = await getGameCardsByEventPaginated(id, page, rowsPerPage);
                    setCards(fetchedCards);
                    setTotalPages(Math.ceil(totalCount / rowsPerPage));

                    // Auto-selection logic
                    const quantityParam = getParam('quantity');
                    const preSelectedParam = location.state?.preSelectedItems;

                    if (selectedItems.length === 0) {
                        if (preSelectedParam && preSelectedParam.length > 0) {
                            // Case 1: Pre-selected specific cards (from QuickSelectModal)
                            setSelectedItems(preSelectedParam);
                        } else if (quantityParam) {
                            // Case 2: Auto-select by quantity (from MarketCard Quick Buy)
                            const qty = parseInt(quantityParam, 10);
                            if (!isNaN(qty) && qty > 0) {
                                const availableCards = fetchedCards.filter(c => c.state === 1 || c.state === 2);
                                const toSelect = availableCards.slice(0, qty);
                                setSelectedItems(toSelect);

                                if (toSelect.length < qty) {
                                    toast.info(`Solo se pudieron seleccionar ${toSelect.length} cartillas disponibles de las ${qty} solicitadas.`);
                                }
                            }
                        }
                    }

                } catch (error) {
                    console.error('Error fetching cards:', error);
                    toast.error('Error al cargar las cartillas');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchCards();
    }, [id, page, rowsPerPage]);

    const handlePageChange = (event, value) => {
        setPage(value - 1); // Pagination component is 1-based, API is 0-based
        // Limpiar selección al cambiar de página (opcional, depende de la UX deseada)
        // setSelectedItems([]);
    };

    const handleSelect = async (item) => {
        if (selectedItems.some((selected) => selected.id === item.id)) {
            setSelectedItems(selectedItems.filter((selected) => selected.id !== item.id));
            return;
        }

        // Verificar disponibilidad antes de seleccionarla
        setCheckingAvailability(true);
        try {
            const { available, message } = await checkCardAvailability(item.id);

            if (available) {
                setSelectedItems([...selectedItems, item]);
            } else {
                toast.info(message || 'Esta cartilla no está disponible');
                // Actualizar el estado de la cartilla en la lista local
                const updatedCards = cards.map((card) => {
                    if (card.id === item.id) {
                        return { ...card, state: 0 }; // Marcar como no disponible
                    }
                    return card;
                });

                setCards(updatedCards);
            }
        } catch (error) {
            console.error('Error al verificar disponibilidad:', error);
        } finally {
            setCheckingAvailability(false);
        }
    };

    // Helper function to check if a card is selected by ID
    const isCardSelected = (cardId) => {
        return selectedItems.some((item) => item.id === cardId);
    };

    // Handle terms acceptance
    const handleAcceptTerms = () => {
        acceptTerms();
        setTermsAccepted(true);
    };

    // Check if payment is allowed
    const isPaymentAllowed = () => {
        return canProceedWithPayment(selectedItems, termsAccepted);
    };

    // Handle payment attempt
    const handlePaymentAttempt = () => {
        if (selectedItems.length < 5) {
            toast.warning('Debes seleccionar al menos 5 cartillas para proceder');
            return false; // Bloquear el pago
        }

        if (!termsAccepted) {
            setOpenTermsModal(true);
            return false; // Bloquear el pago
        }

        return true; // Permitir el pago
    };

    // Función para refrescar las cartillas después de una compra exitosa
    const refreshCards = async () => {
        // Limpiar el cache para forzar una recarga de datos
        clearCardsPaginationCache(id);

        // Recargar la página actual
        setLoading(true);
        try {
            const { cards: fetchedCards, totalCount } = await getGameCardsByEventPaginated(id, page, rowsPerPage);
            setCards(fetchedCards);
            setTotalPages(Math.ceil(totalCount / rowsPerPage));
            setSelectedItems([]); // Limpiar selección
        } catch (error) {
            console.error('Error refreshing cards:', error);
            toast.error('Error al actualizar las cartillas');
        } finally {
            setLoading(false);
        }
    };

    const subtotal = selectedItems.reduce((total, item) => total + Number(item.price), 0);
    const taxes = selectedItems.length > 0 ? selectedItems.length * 0.05 : 0; // Solo costo operativo de 0.05 por cartilla

    const totalToPay = subtotal + taxes;
    const selectedTickets = selectedItems.map((item) => item.num).join('-');
    const invoiceData = {
        userId: userId,
        userName: userName,
        reference: `Cartillas: ${selectedTickets}`,
        cards: selectedItems,
        eventId: id
    };

    return (
        <div>
            <ToastContainer />
            <MessageDark message={name} submessage={date} />
            <h3 hidden>{id}</h3>
            {cards.length > 0 || loading ? (
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {/* Left Column: Cards Grid */}
                    <Grid item xs={12} md={9}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                                Selecciona tus Cartillas
                            </Typography>

                            {/* Modern Legend */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 16, height: 16, borderRadius: 1, border: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.background.paper }} />
                                    <Typography variant="body2" color="text.secondary">Disponible</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: theme.palette.primary.main }} />
                                    <Typography variant="body2" color="text.secondary">Seleccionada</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: theme.palette.action.disabledBackground, opacity: 0.5 }} />
                                    <Typography variant="body2" color="text.secondary">No Disponible</Typography>
                                </Box>
                            </Box>
                        </Box>

                        <CardGrid
                            cards={cards}
                            loading={loading}
                            checkingAvailability={checkingAvailability}
                            isCardSelected={isCardSelected}
                            handleSelect={handleSelect}
                            theme={theme}
                        />
                        <CardPagination
                            totalPages={totalPages}
                            page={page}
                            handlePageChange={handlePageChange}
                            loading={loading}
                            checkingAvailability={checkingAvailability}
                        />
                    </Grid>

                    {/* Right Column: Summary/Cart */}
                    <CardSummary
                        selectedItems={selectedItems}
                        termsAccepted={termsAccepted}
                        setOpenTermsModal={setOpenTermsModal}
                        handleAcceptTerms={handleAcceptTerms}
                        isPaymentAllowed={isPaymentAllowed}
                        handlePaymentAttempt={handlePaymentAttempt}
                        refreshCards={refreshCards}
                        totalToPay={totalToPay}
                        invoiceData={invoiceData}
                        theme={theme}
                    />
                </Grid>
            ) : (
                <EmptyState />
            )}
            <CustomModal open={openCard} handleClose={() => setOpenCard(false)} title={'Cartilla Número: ' + cardN} width={400}>
                <Grid container style={{ marginTop: 20 }}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <BingoCard bN={bingoNumbers.bN} iN={bingoNumbers.iN} nN={bingoNumbers.nN} gN={bingoNumbers.gN} oN={bingoNumbers.oN} />
                    </Grid>
                </Grid>
            </CustomModal>
            <Modal open={openLoader} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <center>
                    <Box sx={uiStyles.loader}>
                        <CircularProgress color="info" size={100} />
                    </Box>
                </center>
            </Modal>

            <TermsModal open={openTermsModal} onClose={() => setOpenTermsModal(false)} onAccept={handleAcceptTerms} />
        </div >
    );
};

export default CardSelector;
