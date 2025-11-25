import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { transactionService } from '../services/transactionService';
import { paymentResponseService } from '../services/paymentResponseService';
import { Alert, AlertTitle, Button, Container, Box, CircularProgress, Typography } from '@mui/material';
import { TransactionTicket } from './TransactionTicket';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentResponse = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Timer de advertencia de 5 minutos
    const timeoutTimer = setTimeout(() => {
      setTimeoutWarning(true);
      toast.warning('La confirmación debe completarse pronto para evitar la reversión del pago', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: false
      });
    }, 240000); // 4 minutos

    const handleTransaction = async () => {
      try {
        const transactionId = searchParams.get('id');
        const clientTransactionId = searchParams.get('clientTransactionId');

        console.log('Procesando transacción:', { transactionId, clientTransactionId });

        if (!transactionId || !clientTransactionId) {
          setError('Faltan parámetros en la URL. La transacción no se pudo procesar.');
          clearTimeout(timeoutTimer);
          return;
        }

        // Verificar si la transacción ya existe usando el servicio
        const existingTransaction = await paymentResponseService.getPaymentByTransaction(transactionId, clientTransactionId);
        if (existingTransaction) {
          console.log('Transacción ya procesada:', existingTransaction);
          setError('Esta transacción ya ha sido validada anteriormente.');
          clearTimeout(timeoutTimer);
          return;
        }

        const storedTransaction = JSON.parse(localStorage.getItem('pyphone_trx'));
        if (!storedTransaction || storedTransaction.clientTransactionId !== clientTransactionId) {
          console.error('No se encontró la transacción en localStorage o no coincide el ID');
          setError('No se encontró el número de transacción. Es posible que haya expirado la sesión.');
          clearTimeout(timeoutTimer);
          return;
        }

        console.log('Datos de transacción almacenados:', storedTransaction);

        // Procesar la transacción usando el servicio
        const result = await transactionService.processTransaction(transactionId, clientTransactionId, storedTransaction);

        clearTimeout(timeoutTimer);
        setResponse(result);

        // Mostrar notificación de éxito
        if (result.statusCode === 3) {
          toast.success('¡Pago procesado exitosamente!', {
            position: toast.POSITION.TOP_CENTER
          });
        }
      } catch (error) {
        console.error('Error al confirmar la transacción:', error);
        clearTimeout(timeoutTimer);

        let errorMsg = 'No fue posible confirmar la transacción. ';
        if (error.message.includes('timeout') || error.message.includes('tiempo')) {
          errorMsg += 'Se agotó el tiempo de confirmación. El pago será revertido automáticamente.';
        } else if (error.message.includes('Authorization')) {
          errorMsg += 'Error de autorización con Payphone.';
        } else {
          errorMsg += error.message || 'Por favor, contacta a soporte si el problema persiste.';
        }

        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    handleTransaction();

    return () => clearTimeout(timeoutTimer);
  }, [searchParams]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer />
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '70vh'
          }}
        >
          <CircularProgress size={70} color="primary" />
          <Typography variant="body1" sx={{ mt: 2, color: '#666' }}>
            Procesando tu pago...
          </Typography>
          <Typography variant="caption" sx={{ mt: 1, color: '#999', textAlign: 'center' }}>
            No cierres esta ventana. La confirmación puede tardar unos segundos.
          </Typography>
          {timeoutWarning && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              La confirmación está tardando más de lo esperado. Por favor, espera...
            </Alert>
          )}
        </Box>
      ) : error ? (
        <Alert
          severity="error"
          sx={{ mt: 4 }}
          action={
            <>
              <Button color="inherit" size="small" onClick={handleGoBack} sx={{ mr: 1 }}>
                Volver
              </Button>
              <Button color="inherit" size="small" onClick={handleGoToDashboard}>
                Ir al Dashboard
              </Button>
            </>
          }
        >
          <AlertTitle>Error en la Transacción</AlertTitle>
          {error}
        </Alert>
      ) : (
        response && (
          <>
            <TransactionTicket response={response} />
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGoToDashboard}
                sx={{ mt: 2 }}
              >
                Ir al Dashboard
              </Button>
            </Box>
          </>
        )
      )}
    </Container>
  );
};

export default PaymentResponse;