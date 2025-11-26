import { Box, Typography, Stack, Pagination } from '@mui/material';

const CardPagination = ({ totalPages, page, handlePageChange, loading, checkingAvailability }) => {
    if (totalPages <= 1) return null;

    return (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Typography variant="body2" sx={{ mb: 1, color: theme => theme.palette.text.secondary }}>
                Página {page + 1} de {totalPages}
            </Typography>
            <Stack spacing={2}>
                <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={handlePageChange}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                    disabled={loading || checkingAvailability}
                />
            </Stack>
        </Box>
    );
};

export default CardPagination;
