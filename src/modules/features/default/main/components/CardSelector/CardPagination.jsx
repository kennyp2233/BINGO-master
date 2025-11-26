import { Grid, Typography, Stack, Pagination } from '@mui/material';

const CardPagination = ({ totalPages, page, handlePageChange, loading, checkingAvailability }) => {
    if (totalPages <= 1) return null;

    return (
        <Grid item xs={12} sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#fff' }}>
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
        </Grid>
    );
};

export default CardPagination;
