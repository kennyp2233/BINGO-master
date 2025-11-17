import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';

import PayPhoneIcon from 'assets/images/icons/payphone_icon.png';
import PayphoneBox from './PayPhoneBox';
import CustomModal from 'components/Modal';

const PayPhoneButton = (props) => {
  const [openPayphone, setOpenPayphone] = React.useState(false);
  const { totalValue, invoiceData, disabled = false, onPaymentAttempt } = props;
  const formattedTotalValue = Number(totalValue.toFixed(2));

  const handleClick = () => {
    let canProceed = !disabled;

    if (onPaymentAttempt) {
      canProceed = onPaymentAttempt() && !disabled;
    }

    // Solo abrir el modal si la validación pasa
    if (canProceed) {
      setOpenPayphone(true);
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          value: isFinite(totalValue) ? totalValue : 0,
          currency: 'USD'
        });
      }
    }
  };

  return (
    <>
      <Button
        variant="contained"
        disabled={disabled}
        sx={{
          mt: 1,
          mr: 1,
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
          '&:hover': {
            backgroundColor: disabled ? 'rgba(255,255,255,0.5)' : '#FFF'
          }
        }}
        style={{
          color: '#FFF',
          height: 60,
          borderRadius: 10,
          width: 280,
          backgroundColor: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        onClick={handleClick}
      >
        <img
          src={PayPhoneIcon}
          alt="PayPhone Icon"
          style={{
            width: 30,
            height: 30,
            opacity: disabled ? 0.5 : 1
          }}
        />
        <span
          style={{
            color: disabled ? '#999' : '#ff6e00',
            fontWeight: 'bold',
            fontSize: 15
          }}
        >
          Pagar ${formattedTotalValue}
        </span>
      </Button>

      <CustomModal
        open={openPayphone}
        handleClose={() => setOpenPayphone(false)}
        title={'Total a pagar $ ' + formattedTotalValue}
        width={400}
      >
        <div style={{ marginTop: 10 }}>
          <center>
            <PayphoneBox totalValue={formattedTotalValue} invoiceData={invoiceData} />
          </center>
        </div>
      </CustomModal>
    </>
  );
};

PayPhoneButton.propTypes = {
  totalValue: PropTypes.number,
  invoiceData: PropTypes.object,
  disabled: PropTypes.bool,
  onPaymentAttempt: PropTypes.func
};

export default PayPhoneButton;
