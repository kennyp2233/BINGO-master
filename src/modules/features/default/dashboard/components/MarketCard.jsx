import PropTypes from 'prop-types';
import { useNavigate, createSearchParams, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Typography, Button, CardContent, Chip, Stack, IconButton, Fade } from '@mui/material';
import { IconCalendar, IconShoppingCart, IconPlayerPlay, IconMinus, IconPlus, IconGridDots, IconCheck, IconX } from '@tabler/icons';
import { motion } from 'framer-motion';
import { useAuth } from 'modules/features/auth/hooks/useAuth';
import { useState, useEffect } from 'react';
import QuickSelectModal from './QuickSelectModal';
import LoginModal from 'modules/features/auth/components/LoginModal';
import { checkEventSoldOut } from 'modules/features/admin/cards';

const StyledCard = styled(motion.div)(({ theme }) => ({
    position: 'relative',
    borderRadius: '12px',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
        border: `1px solid ${theme.palette.primary.main}`,
        boxShadow: `0 4px 20px ${theme.palette.primary.main}26`, // 26 = 15% opacity
    }
}));

const CardImage = styled(Box)(({ theme }) => ({
    height: '140px',
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    padding: '8px 16px',
    boxShadow: 'none',
    width: '100%',
    minWidth: '40px',
    ...(variant === 'contained' && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            boxShadow: 'none',
        },
    }),
    ...(variant === 'outlined' && {
        borderColor: theme.palette.divider,
        color: theme.palette.text.secondary,
        '&:hover': {
            borderColor: theme.palette.text.primary,
            color: theme.palette.text.primary,
            backgroundColor: 'transparent',
        },
    }),
    ...(variant === 'success' && {
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.success.dark,
        },
    }),
}));

const MarketCard = ({ name, date, id, transmition, state }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggin } = useAuth();

    const [quantity, setQuantity] = useState(1);
    const [isBuying, setIsBuying] = useState(false);
    const [openQuickView, setOpenQuickView] = useState(false);
    const [isSoldOut, setIsSoldOut] = useState(false);

    // Login Modal State
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null);

    useEffect(() => {
        const checkAvailability = async () => {
            const soldOut = await checkEventSoldOut(id);
            setIsSoldOut(soldOut);
        };
        checkAvailability();
    }, [id]);

    const handleQuantityChange = (e, change) => {
        e.stopPropagation();
        const newQuantity = Math.max(1, Math.min(100, quantity + change));
        setQuantity(newQuantity);
    };

    const handleNavigation = (path, params, mode = 'manual', extraState = {}) => {
        const rawParams = {
            ...params,
            mode
        };

        if (mode === 'quick') {
            rawParams.quantity = quantity;
        }

        const navigationParams = Object.entries(rawParams).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
                acc[key] = String(value);
            }
            return acc;
        }, {});

        if (!isLoggin) {
            setPendingNavigation({ path, params: navigationParams, extraState });
            setOpenLoginModal(true);
            return;
        }

        navigate({
            pathname: path,
            search: createSearchParams(navigationParams).toString()
        }, {
            state: extraState
        });
    };

    const handleLoginSuccess = (user) => {
        if (pendingNavigation) {
            navigate({
                pathname: pendingNavigation.path,
                search: createSearchParams(pendingNavigation.params).toString()
            }, {
                state: pendingNavigation.extraState
            });
            setPendingNavigation(null);
        }
    };

    const handleBuyClick = (e) => {
        e.stopPropagation();
        setIsBuying(true);
    };

    const handleConfirmBuy = (e) => {
        e.stopPropagation();
        handleNavigation('/app/card-selector', { id, name, date, transmition }, 'quick');
    };

    const handleCancelBuy = (e) => {
        e.stopPropagation();
        setIsBuying(false);
        setQuantity(1);
    };

    const handleQuickView = (e) => {
        e.stopPropagation();
        setOpenQuickView(true);
    };

    const handleQuickSelectionBuy = (selectedItems) => {
        handleNavigation('/app/card-selector', { id, name, date, transmition, quantity: selectedItems.length }, 'manual', { preSelectedItems: selectedItems });
        setOpenQuickView(false);
    };

    return (
        <>
            <StyledCard
                whileHover={{ y: -4 }}
                onClick={(e) => !isBuying && handleNavigation('/app/card-selector', { id, name, date, transmition }, 'manual')}
            >
                <CardImage>
                    <IconCalendar size={48} color="rgba(255,255,255,0.5)" />
                    {state === 1 && !isSoldOut && (
                        <Chip
                            label="EN VIVO"
                            color="error"
                            size="small"
                            sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 'bold', borderRadius: '4px' }}
                        />
                    )}
                    {isSoldOut && (
                        <Chip
                            label="SOLD OUT"
                            color="default"
                            size="small"
                            sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 'bold', borderRadius: '4px', bgcolor: 'rgba(0,0,0,0.7)', color: '#fff' }}
                        />
                    )}
                </CardImage>

                <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, lineHeight: 1.3, fontSize: '1.1rem' }}>
                        {name}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <IconCalendar size={14} /> {date}
                        </Typography>
                    </Stack>

                    <Box sx={{ mt: 'auto', pt: 2, height: '48px', display: 'flex', alignItems: 'center' }}>
                        {!isBuying ? (
                            <Fade in={!isBuying}>
                                <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                                    <ActionButton
                                        variant="contained"
                                        startIcon={<IconShoppingCart size={18} />}
                                        onClick={handleBuyClick}
                                        sx={{ flexGrow: 1, width: 'auto' }}
                                        disabled={isSoldOut}
                                    >
                                        {isSoldOut ? 'Agotado' : 'Comprar'}
                                    </ActionButton>

                                    <ActionButton
                                        variant="outlined"
                                        startIcon={<IconGridDots size={18} />}
                                        sx={{ width: 'auto', px: 2, whiteSpace: 'nowrap' }}
                                        onClick={handleQuickView}
                                        disabled={isSoldOut}
                                    >
                                        Elegir
                                    </ActionButton>

                                    {state === 1 && (
                                        <ActionButton
                                            variant="outlined"
                                            sx={{ width: 'auto', minWidth: '40px', px: 1 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNavigation('/app/play-bingo', { id, name, date, transmition });
                                            }}
                                        >
                                            <IconPlayerPlay size={18} />
                                        </ActionButton>
                                    )}
                                </Stack>
                            </Fade>
                        ) : (
                            <Fade in={isBuying}>
                                <Stack direction="row" spacing={1} sx={{ width: '100%', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'action.hover', borderRadius: '8px', p: 0.5, flexGrow: 1 }}>
                                        <IconButton size="small" onClick={(e) => handleQuantityChange(e, -1)} sx={{ color: 'text.primary', p: 0.5 }}>
                                            <IconMinus size={14} />
                                        </IconButton>
                                        <Typography sx={{ color: 'text.primary', fontWeight: 600, flexGrow: 1, textAlign: 'center', fontSize: '0.9rem' }}>
                                            {quantity}
                                        </Typography>
                                        <IconButton size="small" onClick={(e) => handleQuantityChange(e, 1)} sx={{ color: 'text.primary', p: 0.5 }}>
                                            <IconPlus size={14} />
                                        </IconButton>
                                    </Box>

                                    <ActionButton
                                        variant="success"
                                        sx={{ width: 'auto', minWidth: '40px', px: 1, bgcolor: '#00C853' }}
                                        onClick={handleConfirmBuy}
                                    >
                                        <IconCheck size={18} />
                                    </ActionButton>

                                    <ActionButton
                                        variant="outlined"
                                        sx={{ width: 'auto', minWidth: '40px', px: 1, borderColor: '#ff5252', color: '#ff5252', '&:hover': { borderColor: '#ff1744', color: '#ff1744' } }}
                                        onClick={handleCancelBuy}
                                    >
                                        <IconX size={18} />
                                    </ActionButton>
                                </Stack>
                            </Fade>
                        )}
                    </Box>
                </CardContent>
            </StyledCard>

            <QuickSelectModal
                open={openQuickView}
                onClose={() => setOpenQuickView(false)}
                eventId={id}
                eventName={name}
                onBuySelection={handleQuickSelectionBuy}
            />

            <LoginModal
                open={openLoginModal}
                onClose={() => setOpenLoginModal(false)}
                onSuccess={handleLoginSuccess}
            />
        </>
    );
};

MarketCard.propTypes = {
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    transmition: PropTypes.string,
    state: PropTypes.number.isRequired
};

export default MarketCard;
