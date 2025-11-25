import React from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PayPalButtons } from '@paypal/react-paypal-js';

const PayPalButton = (props) => {
  let navigate = useNavigate();
  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: props.invoice,
              amount: {
                value: props.totalValue + ''
              }
            }
          ]
        });
      }}
      onApprove={async (data, actions) => {
        const order = await actions.order?.capture();
        console.log('order', order);
        if (order.status == 'COMPLETED') {
          const object = props.object;
          console.log('Operación exitosa', object);

          //TODO

          navigate({
            pathname: '/app/success',
            search: createSearchParams({ status: order.status, order: order.id }).toString()
          });
        } else {
          navigate({
            pathname: '/app/failure',
            search: createSearchParams({ status: order.status, order: order.id }).toString()
          });
        }
      }}
    />
  );
};

PayPalButton.propTypes = {
  invoice: PropTypes.string,
  totalValue: PropTypes.string,
  object: PropTypes.object
};

export default PayPalButton;