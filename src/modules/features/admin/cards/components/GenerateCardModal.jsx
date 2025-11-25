import { useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Modal,
  OutlinedInput,
  Tooltip,
  Typography
} from '@mui/material';
import { IconCards, IconPlus } from '@tabler/icons';
import { uiStyles } from 'modules/features/admin/cards';
import { useTheme } from '@mui/material/styles';
import { generateUniqueBingoCards } from 'utils/generateUniqueBingoCards';
import { createDocument } from 'modules/shared/services/firebaseCommon';
import { collCards } from 'store/collections';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { titles } from 'modules/features/admin/cards';

export const GenerateCardModal = ({ event, totalCards, onCardsGenerated }) => {
  // console.log({ event, totalCards });
  const theme = useTheme();
  const [openCreateCard, setOpenCreateCard] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [openLoader, setOpenLoader] = useState(false);

  const handleOpenCreateCard = () => {
    setOpenCreateCard(true);
  };

  const handleCloseCreateCard = () => {
    setOpenCreateCard(false);
  };

  const handleGenerateCards = () => {
    if (quantity > 0) {
      setOpenLoader(true);
      const cards = generateUniqueBingoCards(quantity, event.ide, event.name, event.price, totalCards);
      // console.log({ cards });
      for (let index = 0; index < quantity; index++) {
        createDocument(collCards, cards[index].id, cards[index]);
      }
      setTimeout(() => {
        setOpenLoader(false);
        toast.success(titles.successCardCreate, { position: toast.POSITION.TOP_RIGHT });
        setOpenCreateCard(false);
        if (onCardsGenerated) onCardsGenerated(); // Refresh table data
      }, parseInt(quantity) * 50);
    } else {
      toast.info('Debe ingresar una cantidad de cartillas para crearlas!', { position: toast.POSITION.TOP_RIGHT });
    }
  };

  return (
    <>
      <Tooltip title="Agregar Cartillas">
        <IconButton color="inherit" onClick={() => handleOpenCreateCard()}>
          <IconPlus color="#FFF" />
        </IconButton>
      </Tooltip>
      <Modal
        open={openCreateCard}
        onClose={handleCloseCreateCard}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={uiStyles.modalStyles}>
          <Typography id="modal-modal-title" variant="h3" component="h3" align="center">
            Generar Cartillas
          </Typography>
          <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                      <InputLabel htmlFor="quantity">
                        <span>*</span> {'Ingrese la cantidad de cartillas a generar'}
                      </InputLabel>
                      <OutlinedInput
                        id={'quantity'}
                        type="number"
                        name={'quantity'}
                        inputProps={{}}
                        onChange={(ev) => setQuantity(Number(ev.target.value))}
                      />
                    </FormControl>
                  </center>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        startIcon={<IconCards />}
                        variant="contained"
                        style={{ color: '#FFF', height: 50, width: 180 }}
                        onClick={handleGenerateCards}
                      >
                        Generar
                      </Button>
                    </ButtonGroup>
                  </center>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Modal open={openLoader} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <center>
          <Box sx={uiStyles.modalStylesLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </>
  );
};

GenerateCardModal.propTypes = {
  event: PropTypes.object,
  totalCards: PropTypes.number,
  onCardsGenerated: PropTypes.func
};