import { Grid, Box, Typography, Link, ButtonBase, Divider, Chip, Stack, Checkbox, FormControlLabel } from '@mui/material';
import { PayphoneButton } from '../../../payment';
import { IconShoppingCart, IconTicket } from '@tabler/icons';

const CardSummary = ({
    selectedItems,
    termsAccepted,
    setOpenTermsModal,
    handleAcceptTerms,
    isPaymentAllowed,
    handlePaymentAttempt,
    refreshCards,
    totalToPay,
    invoiceData,
    theme
}) => {
    const subtotal = selectedItems.reduce((total, item) => total + Number(item.price), 0);
    // Assuming taxes logic from parent is consistent, but for display we might want to show it here if needed.
    // For now, using the totalToPay passed from parent.

    return (
        <Grid item xs={12} md={3}>
            <Box
                sx={{
                    position: 'sticky',
                    top: 100,
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 4,
                    p: 3,
                    boxShadow: theme.shadows[3],
                    border: `1px solid ${theme.palette.divider}`
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <IconShoppingCart size={24} color={theme.palette.primary.main} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Tu Carrito
                    </Typography>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                {/* Selected Items List */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                        Cartillas Seleccionadas ({selectedItems.length})
                    </Typography>

                    {selectedItems.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: '200px', overflowY: 'auto' }}>
                            {selectedItems.map((item) => (
                                <Chip
                                    key={item.id}
                                    icon={<IconTicket size={14} />}
                                    label={`#${item.order}`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body2" sx={{ color: theme.palette.text.disabled, fontStyle: 'italic' }}>
                            No has seleccionado ninguna cartilla aún.
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Price Breakdown */}
                <Box sx={{ mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                        <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Impuestos y Cargos</Typography>
                        <Typography variant="body2">${(totalToPay - subtotal).toFixed(2)}</Typography>
                    </Stack>
                    <Divider sx={{ borderStyle: 'dashed', mb: 2 }} />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5" fontWeight="bold">Total a Pagar</Typography>
                        <Typography variant="h4" color="primary" fontWeight="bold">${totalToPay.toFixed(2)}</Typography>
                    </Stack>
                </Box>

                {/* Validation Messages */}
                {selectedItems.length > 0 && selectedItems.length < 5 && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mb: 2, textAlign: 'center', bgcolor: '#ffebee', p: 1, borderRadius: 1 }}>
                        Mínimo 5 cartillas requeridas
                    </Typography>
                )}

                {/* Terms */}
                <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={termsAccepted}
                                onChange={handleAcceptTerms}
                                color="primary"
                                disabled={selectedItems.length < 5}
                            />
                        }
                        label={
                            <Typography variant="body2">
                                Acepto los <Link component="button" onClick={(e) => { e.preventDefault(); setOpenTermsModal(true); }} sx={{ fontWeight: 'bold' }}>términos y condiciones</Link>
                            </Typography>
                        }
                    />
                </Box>

                {/* Pay Button */}
                <Box sx={{ width: '100%' }}>
                    <PayphoneButton
                        totalValue={totalToPay}
                        invoiceData={invoiceData}
                        disabled={!isPaymentAllowed()}
                        onPaymentAttempt={handlePaymentAttempt}
                        onPaymentSuccess={refreshCards}
                        fullWidth
                    />
                </Box>
            </Box>
        </Grid>
    );
};

export default CardSummary;
