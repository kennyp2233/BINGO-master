import PropTypes from 'prop-types';
import { Grid, Typography, Box, Button, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ItemBingo from 'modules/shared/components/bingo/ItemBingo';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { generateId } from 'utils/idGenerator';
import { fullDate } from 'utils/validations';
import { createDocument, updateDocument } from 'modules/shared/services/firebaseCommon';
import { collCards, collUserCards, collPayments } from 'store/collections';
import { BingoPDFButton } from 'modules/features/admin/bingo-pdf';

export const PurchaseSummaryStep = (props) => {
  const { selectedItems, event, user, finishAssign, setFinishAssign, handleResetSteps } = props;
  const [isProcessing, setIsProcessing] = useState(false);
  const theme = useTheme();
  const { ide, name, eventDate, price } = event;

  // console.log({ selectedItems, event, user });

  const handleSubmit = async () => {
    try {
      setIsProcessing(true);

      const promises = selectedItems.map(async (item) => {
        const cardId = generateId(10);
        const cardData = {
          id: cardId,
          idCard: item.id,
          num: item.num,
          eventId: event.ide,
          eventName: event.name,
          eventDate: event.startDate,
          order: item.order,
          b: item.b,
          i: item.i,
          n: item.n,
          g: item.g,
          o: item.o,
          bingoNumbers: item.bingoNumbers,
          state: 0,
          createAt: fullDate(),
          userId: user.id,
          userName: user.fullName
        };

        const updateData = {
          state: 0,
          updateAt: fullDate()
        };

        await Promise.all([createDocument(collUserCards, cardId, cardData), updateDocument(collCards, item.id, updateData)]);

        return cardId;
      });

      await Promise.all(promises);

      // Save payment
      const cardsNumbers = selectedItems.map((item) => item.num).join(', ');
      const paymentId = generateId(10);
      const paymentData = {
        id: paymentId,
        createAt: fullDate(),
        userId: user.id,
        userName: user.fullName,
        details: `Cartillas evento: ${event.name}`,
        card: cardsNumbers,
        total: selectedItems.length * price,
        transactionId: paymentId,
        clientTransactionId: generateId(8),
        eventId: event.ide,
        statusCode: 3, // Assuming 3 is approved as in processTransaction
        status: 'Aprobado',
        provider: 'Manual'
      };

      await createDocument(collPayments, paymentId, paymentData);

      toast.success('Asignación realizada exitosamente!');
      setFinishAssign(true);
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      toast.error('Error al procesar la asignación');
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
        Cartillas Seleccionadas
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
        <Typography variant="h4">Total a Pagar:</Typography>
        <Typography variant="h4" color="primary">
          ${total}
        </Typography>
      </Box>

      {finishAssign ? (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="contained" onClick={handleResetSteps} color="primary" style={{ color: '#FFF' }}>
            Finalizar Asignación
          </Button>
          <BingoPDFButton bingoCards={selectedItems} event={event} user={user} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="contained" onClick={handleSubmit} color="success" style={{ color: '#FFF' }} disabled={isProcessing}>
            {isProcessing ? 'Procesando...' : 'Procesar Compra'}
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
