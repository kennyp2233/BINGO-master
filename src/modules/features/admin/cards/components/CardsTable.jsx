import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  CircularProgress,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import { titles, uiStyles } from 'modules/features/admin/cards';
import { ModalCard } from 'modules/shared/components/cards/ModalCard';
import MessageDark from 'modules/shared/components/message/MessageDark';
import { deleteDocument } from 'modules/shared/services/firebaseCommon';
import { getGameCardsByEventPaginated } from 'modules/features/admin/cards';
import { bingoValues, genConst } from 'store/constant';
import { toast } from 'react-toastify';
import { collCards } from 'store/collections';

export const CardsTable = ({ eventId, refreshRef, totalCards, setTotalCards }) => {
  const [cards, setCards] = useState([]);
  // const [totalCards, setTotalCards] = useState(0);
  const [pageC, setPageC] = useState(0);
  const [rowsPerPageC, setRowsPerPageC] = useState(10);
  const [openLoader, setOpenLoader] = useState(false);
  const [loading, setLoading] = useState(false);

  // console.log({ cards });

  const fetchCards = async () => {
    if (!eventId) return;

    setLoading(true);
    try {
      const { cards: fetchedCards, totalCount } = await getGameCardsByEventPaginated(eventId, pageC, rowsPerPageC);
      setCards(fetchedCards);
      setTotalCards(totalCount);
    } catch (error) {
      console.error('Error fetching cards:', error);
      toast.error('Error al cargar las cartillas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [eventId, pageC, rowsPerPageC]);

  useEffect(() => {
    if (refreshRef) refreshRef.current = fetchCards;
  }, [refreshRef, fetchCards]);

  const handleChangePageC = (event, newPage) => {
    setCards([]);
    setPageC(newPage);
  };

  const handleChangeRowsPerPageC = (event) => {
    setCards([]);
    setRowsPerPageC(+event.target.value);
    setPageC(0);
  };

  const handleDelete = async (id) => {
    setOpenLoader(true);
    try {
      await deleteDocument(collCards, id);
      await fetchCards();
      toast.success(titles.successCardDelete, { position: toast.POSITION.TOP_RIGHT });
    } catch (error) {
      toast.error('Error al eliminar la cartilla', { position: toast.POSITION.TOP_RIGHT });
    } finally {
      setOpenLoader(false);
    }
  };

  if (loading) {
    return (
      <Grid container style={{ marginTop: 20 }}>
        <Grid item xs={12}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <MessageDark message={titles.loading} submessage="" />
          </Grid>
        </Grid>
      </Grid>
    );
  }

  return (
    <div style={{ marginTop: 10 }}>
      {cards.length > 0 ? (
        <Paper sx={uiStyles.paper}>
          <TableContainer sx={{ maxHeight: '100%' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-col1" align="left" style={{ minWidth: 40, fontWeight: 'bold' }}>
                    {'Card ID'}
                  </TableCell>
                  <TableCell key="id-col2" align="left" style={{ minWidth: 40, fontWeight: 'bold' }}>
                    {'Número'}
                  </TableCell>
                  <TableCell key="id-col3" align="left" style={{ minWidth: 40, fontWeight: 'bold' }}>
                    {'Precio'}
                  </TableCell>
                  <TableCell key="id-col4" align="left" style={{ minWidth: 40, fontWeight: 'bold' }}>
                    {'Estado'}
                  </TableCell>
                  <TableCell key="id-col5" align="left" style={{ minWidth: 40, fontWeight: 'bold' }}>
                    {'Fecha'}
                  </TableCell>
                  <TableCell key="id-actions" align="center" style={{ minWidth: 60, fontWeight: 'bold' }}>
                    {'Acciones'}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  cards.map((card) => (
                    <TableRow hover key={card.id}>
                      <TableCell align="left">{card.id}</TableCell>
                      <TableCell align="left">{card.num}</TableCell>
                      <TableCell align="left">
                        <b>$ </b>
                        {card.price}
                      </TableCell>
                      <TableCell align="left">
                        {card.state == bingoValues.STATE_AVAILABLE ? (
                          <span style={{ color: genConst.CONST_SUCCESS_COLOR, fontWeight: 'bold' }}>
                            {bingoValues.STATE_DESC_AVAILABLE}
                          </span>
                        ) : card.state == bingoValues.STATE_RETURNED ? (
                          <span style={{ color: 'orange', fontWeight: 'bold' }}>{bingoValues.STATE_DESC_RETURNED}</span>
                        ) : (
                          <span style={{ color: genConst.CONST_ERROR_COLOR, fontWeight: 'bold' }}>
                            {bingoValues.STATE_DESC_NOT_AVAILABLE}
                          </span>
                        )}
                      </TableCell>
                      <TableCell align="left">{card.createAt}</TableCell>
                      <TableCell align="center">
                        <ModalCard bingoCard={card} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100, 200, 500, 1000]}
            labelRowsPerPage={titles.rowsPerPage}
            component="div"
            count={totalCards}
            rowsPerPage={rowsPerPageC}
            page={pageC}
            onPageChange={handleChangePageC}
            onRowsPerPageChange={handleChangeRowsPerPageC}
          />
        </Paper>
      ) : (
        <Grid container style={{ marginTop: 20 }}>
          <Grid item xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <MessageDark message={titles.noCardsFound} submessage="" />
            </Grid>
          </Grid>
        </Grid>
      )}
      <Modal open={openLoader} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <center>
          <Box sx={uiStyles.modalStylesLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </div>
  );
};

CardsTable.propTypes = {
  eventId: PropTypes.string.isRequired,
  refreshRef: PropTypes.object,
  totalCards: PropTypes.number,
  setTotalCards: PropTypes.func
};

