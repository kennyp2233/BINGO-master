import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import { useNavigate } from 'react-router';

export const TransactionTicket = ({ response }) => {
  const navigate = useNavigate();

  const formatStatus = (status) => {
    switch (status) {
      case 2:
        return 'Cancelado';
      case 3:
        return 'Aprobado';
      default:
        return 'Pendiente';
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mt: 4,
        borderRadius: 2,
        maxWidth: 500,
        mx: 'auto'
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        {response.statusCode === 3 ? (
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
        ) : (
          <CancelOutlined color="error" sx={{ fontSize: 80, mb: 2 }} />
        )}
        <Typography variant="h4" color={response.statusCode === 3 ? 'success.main' : 'error.main'} fontWeight="bold">
          Pago {formatStatus(response.statusCode)}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Transacción ID
          </Typography>
          <Typography variant="body2">{response.transactionId}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Fecha
          </Typography>
          <Typography variant="body2">{response.date}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Referencia
          </Typography>
          <Typography variant="body2">{response.reference}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="text.secondary">
            N° Documento
          </Typography>
          <Typography variant="body2">{response.document}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Monto
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            ${(Number(response.amount) / 100).toFixed(2)}
          </Typography>
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigate('/app/my-tickets');
          }}
          style={{
            color: 'white'
          }}
        >
          Ver mis tickets
        </Button>
      </Box>
    </Paper>
  );
};