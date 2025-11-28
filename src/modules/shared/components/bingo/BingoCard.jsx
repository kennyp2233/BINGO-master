import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from '@mui/material';

const BingoCard = ({ bN, iN, nN, gN, oN }) => {
  return (
    <div style={{ marginTop: 20 }}>
      <center>
        {/* Columna B */}
        <ButtonGroup aria-label="B column" orientation="vertical">
          <Button variant="contained" style={{ color: '#FFF', fontWeight: 'bold', height: 55, width: 55, borderRadius: 0 }}>
            B
          </Button>
          {bN.map((item, key) => (
            <Button key={'b' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
              {item}
            </Button>
          ))}
        </ButtonGroup>

        {/* Columna I */}
        <ButtonGroup aria-label="I column" orientation="vertical">
          <Button variant="contained" style={{ color: '#FFF', fontWeight: 'bold', height: 55, width: 55, borderRadius: 0 }}>
            I
          </Button>
          {iN.map((item, key) => (
            <Button key={'i' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
              {item}
            </Button>
          ))}
        </ButtonGroup>

        {/* Columna N */}
        <ButtonGroup aria-label="N column" orientation="vertical">
          <Button variant="contained" style={{ color: '#FFF', fontWeight: 'bold', height: 55, width: 55, borderRadius: 0 }}>
            N
          </Button>
          {nN.map((item, key) =>
            item === 'FREE' ? (
              <Button key={'n' + key} variant="contained" style={{ height: 55, width: 55, color: '#FFF', borderRadius: 0 }}>
                FREE
              </Button>
            ) : (
              <Button key={'n' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
                {item}
              </Button>
            )
          )}
        </ButtonGroup>

        {/* Columna G */}
        <ButtonGroup aria-label="G column" orientation="vertical">
          <Button variant="contained" style={{ color: '#FFF', fontWeight: 'bold', height: 55, width: 55, borderRadius: 0 }}>
            G
          </Button>
          {gN.map((item, key) => (
            <Button key={'g' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
              {item}
            </Button>
          ))}
        </ButtonGroup>

        {/* Columna O */}
        <ButtonGroup aria-label="O column" orientation="vertical">
          <Button variant="contained" style={{ color: '#FFF', fontWeight: 'bold', height: 55, width: 55, borderRadius: 0 }}>
            O
          </Button>
          {oN.map((item, key) => (
            <Button key={'o' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
              {item}
            </Button>
          ))}
        </ButtonGroup>
      </center>
    </div>
  );
};

BingoCard.propTypes = {
  bN: PropTypes.arrayOf(PropTypes.number).isRequired, // Arreglo de números
  iN: PropTypes.arrayOf(PropTypes.number).isRequired, // Arreglo de números
  nN: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired, // Arreglo de números o 'FREE'
  gN: PropTypes.arrayOf(PropTypes.number).isRequired, // Arreglo de números
  oN: PropTypes.arrayOf(PropTypes.number).isRequired // Arreglo de números
};

export default BingoCard;
