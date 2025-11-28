import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, ButtonGroup, Grid, Modal, Typography } from '@mui/material';
import { IconCircleX, IconEye } from '@tabler/icons';

import { titles, uiStyles } from 'modules/features/admin/cards';
import { genConst } from 'store/constant';
import { getLetters } from 'utils/bingoConfig';

export const ModalCard = ({ bingoCard }) => {
  const [openCard, setOpenCard] = useState(false);

  const handleOpenCard = () => {
    setOpenCard(true);
  };

  const handleCloseCard = () => {
    setOpenCard(false);
  };

  return (
    <>
      <Button
        style={{ backgroundColor: genConst.CONST_UPDATE_COLOR, color: '#FFF' }}
        onClick={() => {
          handleOpenCard();
        }}
      >
        <IconEye />
      </Button>
      <Modal open={openCard} onClose={handleCloseCard} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStylesDelete}>
          <Typography id="modal-modal-title" variant="h3" component="h3" align="center">
            Cartilla: 0000{bingoCard.num}
          </Typography>
          <div style={{ marginTop: 20 }}>
            <center>
              {getLetters().map((letter) => (
                <ButtonGroup key={letter} aria-label="Basic button group" orientation="vertical">
                  <Button variant="contained" style={{ color: '#FFF', fontWeight: 'bold', height: 55, width: 55, borderRadius: 0 }}>
                    {letter}
                  </Button>
                  {bingoCard[letter.toLowerCase()].map((item, key) =>
                    item === 'FREE' ? (
                      <Button key={letter + key} variant="contained" style={{ height: 55, width: 55, color: '#FFF', borderRadius: 0 }}>
                        FREE
                      </Button>
                    ) : (
                      <Button key={letter + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
                        {item}
                      </Button>
                    )
                  )}
                </ButtonGroup>
              ))}
            </center>
          </div>
          <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={<IconCircleX />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF' }}
                        onClick={handleCloseCard}
                      >
                        {titles.buttonClose}
                      </Button>
                    </ButtonGroup>
                  </center>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

ModalCard.propTypes = {
  bingoCard: PropTypes.object
};
