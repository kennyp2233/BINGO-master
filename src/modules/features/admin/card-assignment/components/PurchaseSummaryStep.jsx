import PropTypes from 'prop-types';
import { Grid, Typography, Box, Button, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ItemBingo from 'components/bingo/ItemBingo';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { processCardAssignment } from '../services/cardAssignmentService';
import { BingoPDFButton } from 'modules/features/admin/bingo-pdf';
import { titles } from '../card-assignment.texts';

export const PurchaseSummaryStep = (props) => {
  const { selectedItems, event, user, finishAssign, setFinishAssign, handleResetSteps } = props;
  const [isProcessing, setIsProcessing] = useState(false);
  const theme = useTheme();
  const { ide, name, eventDate, price } = event;

  // console.log({ selectedItems, event, user });

  const handleSubmit = async () => {
    try {
      setIsProcessing(true);

      // Usar el servicio de asignación
      await processCardAssignment(selectedItems, event, user);

      toast.success(titles.successAssignment);
      setFinishAssign(true);
    } catch (error) {
      console.error('Error al procesar la asignación:', error);
      toast.error(error.message || titles.errorAssignment);
    } finally {
      setIsProcessing(false);
    }
  };

  const total = selectedItems.length * price;

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'background.default',
        borderRadius: 3
      }}
    >
      <Typography variant="h3" gutterBottom>
        {name}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Typography variant="h5">Usuario: {user?.fullName}</Typography>
          <Typography variant="h5">Fecha evento: {event?.startDate}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5">Precio por cartilla: ${price}</Typography>
          <Typography variant="h5">Cantidad: {selectedItems.length}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" gutterBottom>
        {titles.selectedCards}
      </Typography>
      <Grid container spacing={6} sx={{ mb: 2 }}>
        {selectedItems.map((item) => (
          <Grid key={item.id} item lg={1} md={1} sm={2} xs={2}>
            <ItemBingo title={`Cartilla ${item.order}`} item={item} theme={theme} disabled setCardN={() => {}} />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">{titles.totalToPay}:</Typography>
        <Typography variant="h4" color="primary">
          ${total}
        </Typography>
      </Box>

      {finishAssign ? (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="contained" onClick={handleResetSteps} color="primary" style={{ color: '#FFF' }}>
            {titles.buttonFinish}
          </Button>
          <BingoPDFButton bingoCards={selectedItems} event={event} user={user} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="contained" onClick={handleSubmit} color="success" style={{ color: '#FFF' }} disabled={isProcessing}>
            {isProcessing ? titles.processing : titles.buttonProcess}
          </Button>
        </Box>
      )}
    </Box>
  );
};

PurchaseSummaryStep.propTypes = {
  selectedItems: PropTypes.array.isRequired,
  event: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  finishAssign: PropTypes.bool.isRequired,
  setFinishAssign: PropTypes.func.isRequired,
  handleResetSteps: PropTypes.func.isRequired
};