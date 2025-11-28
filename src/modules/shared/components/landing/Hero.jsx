/* eslint-disable react/prop-types */
import React from 'react';
import { Collapse } from '@mui/material';
import { uiStyles } from './styles';

export default function Hero({ checked }) {
  return (
    <Collapse in={checked} {...(checked ? { timeout: 1000 } : {})} collapsedSize={50}>
      <div style={uiStyles.container}>
        <h3 style={uiStyles.title}>
          BingoBingo
          <br />
          <span style={uiStyles.colorBlueText}> ONLINE</span>
        </h3>
      </div>
    </Collapse>
  );
}
