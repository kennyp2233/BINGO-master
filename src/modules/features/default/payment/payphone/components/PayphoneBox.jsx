import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { payphoneService } from '../services/payphoneService';
import { Alert } from '@mui/material';

const PayphoneBox = (props) => {
  const { totalValue, invoiceData, onPaymentSuccess, onClose } = props;
  const ppbRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutos en segundos
  const timeoutRef = useRef(null);

  // Timer para el timeout de 10 minutos
  useEffect(() => {
    if (isLoaded) {
      timeoutRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timeoutRef.current);
            setError('El formulario de pago ha expirado. Por favor, cierra e intenta nuevamente.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timeoutRef.current) {
          clearInterval(timeoutRef.current);
        }
      };
    }
  }, [isLoaded]);

  useEffect(() => {
    const initializePayphone = () => {
      try {
        console.log('Intentando inicializar Payphone, intento:', retryCount + 1);
        console.log('window.PPaymentButtonBox existe:', typeof window.PPaymentButtonBox);
        console.log('totalValue:', totalValue);
        console.log('invoiceData:', invoiceData);

        // Verificar si PPaymentButtonBox está disponible
        if (typeof window.PPaymentButtonBox === 'undefined') {
          if (retryCount < 10) { // Máximo 10 intentos
            console.warn(`PPaymentButtonBox no está disponible, reintentando en 1s... (intento ${retryCount + 1})`);
            setRetryCount(prev => prev + 1);
            setTimeout(initializePayphone, 1000);
          } else {
            throw new Error('PPaymentButtonBox no se cargó después de 10 intentos. Verifica que los scripts estén cargados correctamente en index.html');
          }
          return;
        }

        // Limpiar instancia anterior si existe
        if (ppbRef.current) {
          console.log('Limpiando instancia anterior de Payphone');
          // No hay método destroy documentado, pero podemos intentar limpiar el DOM
          const buttonElement = document.getElementById('pp-button');
          if (buttonElement) {
            buttonElement.innerHTML = '';
          }
        }

        // Usar el servicio para configurar el botón
        const config = payphoneService.configurePayphoneButton(totalValue, invoiceData);
        console.log('Configuración generada:', config);

        // Verificar que los valores requeridos estén presentes
        if (!config.token || !config.amount || !config.clientTransactionId) {
          throw new Error('Configuración incompleta: faltan token, amount o clientTransactionId');
        }

        // Verificar que el dominio actual esté autorizado
        if (!config.responseUrl) {
          throw new Error('No se pudo generar la URL de respuesta. Verifica la configuración del dominio.');
        }

        // Configuración de Payphone
        console.log('Creando instancia de PPaymentButtonBox...');
        const ppb = new window.PPaymentButtonBox(config);

        ppbRef.current = ppb;

        // Verificar que el elemento existe antes de renderizar
        const buttonElement = document.getElementById('pp-button');
        if (!buttonElement) {
          throw new Error('Elemento #pp-button no encontrado');
        }

        console.log('Renderizando Payphone en #pp-button...');
        ppb.render('#pp-button');

        setIsLoaded(true);
        setError(null);
        console.log('Payphone inicializado correctamente');

      } catch (error) {
        console.error('Error inicializando Payphone:', error);

        // Mensajes de error más específicos
        let errorMessage = error.message;
        if (error.message.includes('Authorization denied') || error.message.includes('dominio')) {
          errorMessage = 'Error de autorización: El dominio actual no está autorizado. Verifica la configuración en Payphone Developer Console.';
        }

        setError(errorMessage);
      }
    };

    // Pequeño delay para asegurar que el DOM esté listo
    setTimeout(initializePayphone, 100);
  }, [totalValue, invoiceData, retryCount]);

  // Formatear tiempo restante
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ minHeight: '50px' }}>
      <div id="pp-button"></div>

      {error && (
        <Alert severity="error" sx={{ mt: 2, fontSize: '12px' }}>
          {error}
        </Alert>
      )}

      {!isLoaded && !error && (
        <Alert severity="info" sx={{ mt: 2, fontSize: '12px' }}>
          Cargando Payphone... (intento {retryCount + 1})
        </Alert>
      )}

      {isLoaded && !error && (
        <>
          <Alert severity="success" sx={{ mt: 1, fontSize: '12px' }}>
            Payphone listo ✓
          </Alert>

          {/* Advertencia de tiempo */}
          {timeRemaining > 0 && timeRemaining <= 120 && (
            <Alert severity="warning" sx={{ mt: 1, fontSize: '11px' }}>
              ⚠️ Tiempo restante: {formatTime(timeRemaining)}. El formulario expira pronto.
            </Alert>
          )}

          {timeRemaining > 120 && (
            <div style={{
              padding: '8px',
              color: '#666',
              fontSize: '11px',
              textAlign: 'center',
              marginTop: '8px'
            }}>
              Tiempo restante: {formatTime(timeRemaining)}
            </div>
          )}

          {/* Información importante */}
          <Alert severity="info" sx={{ mt: 1, fontSize: '10px' }}>
            <strong>Importante:</strong> Después de completar el pago, tienes 5 minutos para confirmar la transacción.
          </Alert>
        </>
      )}
    </div>
  );
};

PayphoneBox.propTypes = {
  totalValue: PropTypes.number,
  invoiceData: PropTypes.object,
  onPaymentSuccess: PropTypes.func,
  onClose: PropTypes.func
};

export default PayphoneBox;