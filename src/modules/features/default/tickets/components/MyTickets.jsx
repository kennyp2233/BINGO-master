import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography
} from '@mui/material';
import { IconCalendar, IconCheck, IconCircleX, IconTicket } from '@tabler/icons';
import { uiStyles } from './MyTickets.styles';
import { getAllEvents, getUserCardsForEvent, formatCardNumber } from '../services/ticketsService';
import { getCardsByEventUsers } from '../../../admin/cards';
import { bingoValues, genConst } from 'store/constant';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';
import MessageDark from 'components/message/MessageDark';

function MyTickets() {
  const [eventList, setEventList] = useState([]);
  const [cardList, setCardList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [eventName, setEventName] = useState(null);
  const [isTicketShow, setIsTicketShow] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [cardN, setCardN] = useState(0);
  const [bN, setBN] = useState([]);
  const [iN, setIN] = useState([]);
  const [nN, setNN] = useState([]);
  const [gN, setGN] = useState([]);
  const [oN, setON] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    onAuthStateChanged(authentication, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.log('No user');
      }
    });

    const getData = async () => {
      const events = await getAllEvents();
      setEventList(events);
    };
    getData();
  }, []);

  const handleOpenCard = () => {
    setOpenCard(true);
  };
  const handleCloseCard = () => {
    setOpenCard(false);
  };

  return (
    <div>
      <AppBar position="static" style={uiStyles.appbar}>
        <Toolbar>
          <IconButton color="inherit">
            <IconTicket color="#FFF" />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#FFF' }} align="center">
            Mis Cartillas
          </Typography>
          <IconButton color="inherit">
            <IconCalendar color="#FFF" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Paper style={{ marginTop: 10 }}>
        <TableContainer sx={{ maxHeight: '100%' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell key="id-name" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                  Evento
                </TableCell>
                <TableCell key="id-date" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                  Fecha
                </TableCell>
                <TableCell key="id-state" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                  Estado
                </TableCell>
                <TableCell key="id-actions" align="center" style={{ minWidth: 100, fontWeight: 'bold' }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
                <TableRow hover key={r.ide}>
                  <TableCell align="left">{r.name}</TableCell>
                  <TableCell align="left">{r.startDate}</TableCell>
                  <TableCell align="left">
                    {r.state === 0 ? (
                      <span style={{ color: genConst.CONST_INFO_COLOR, fontWeight: 'bold' }}>{bingoValues.STATE_EV_INC}</span>
                    ) : r.state === 1 ? (
                      <span style={{ color: genConst.CONST_SUCCESS_COLOR, fontWeight: 'bold' }}>{bingoValues.STATE_EV_ACT}</span>
                    ) : (
                      <span style={{ color: genConst.CONST_ERROR_COLOR, fontWeight: 'bold' }}>{bingoValues.STATE_EV_END}</span>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup variant="contained">
                      <Button
                        style={{ backgroundColor: genConst.CONST_CREATE_COLOR }}
                        onClick={async () => {
                          setEventName(r.name);
                          const cards = await getUserCardsForEvent(r.ide, userId);
                          setCardList(cards);
                          setIsTicketShow(true);
                        }}
                      >
                        <IconCheck color="#FFF" />
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          labelRowsPerPage={'Registros máximos'}
          component="div"
          count={eventList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {isTicketShow ? (
        <Paper style={{ marginTop: 10 }}>
          <Typography sx={{ p: 2 }} variant="h4" id="tableTitle" component="div" align="center">
            Evento: {eventName}
          </Typography>
          {cardList.length > 0 ? (
            <>
              <Grid container style={{ marginTop: 20, marginBottom: 40, padding: 20 }}>
                {cardList.map((r) => (
                  <Grid item lg={1} md={1} sm={1} xs={2} key={r.id}>
                    <Button
                      variant="containded"
                      style={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF', height: 40 }}
                      onClick={() => {
                        handleOpenCard();
                        setCardN(r.num);
                        setBN(r.b);
                        setIN(r.i);
                        setNN(r.n);
                        setGN(r.g);
                        setON(r.o);
                      }}
                    >
                      {r.order}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <Grid container style={{ marginTop: 20 }}>
              <Grid item xs={12}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <MessageDark message={'No tienes cartillas para el evento seleccionado!'} submessage="" />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Paper>
      ) : (
        <></>
      )}
      <Modal open={openCard} onClose={handleCloseCard} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStylesDelete}>
          <Typography id="modal-modal-title" variant="h3" component="h3" align="center">
            Cartilla: {formatCardNumber(cardN)}
          </Typography>
          <div style={{ marginTop: 20 }}>
            <center>
              <ButtonGroup aria-label="Basic button group" orientation="vertical">
                <Button variant="contained" style={{ color: '#FFF', fontWeight: 'bold', height: 55, width: 55, borderRadius: 0 }}>
                  B
                </Button>
                {bN.map((item, key) => (
                  <Button key={'b' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
                    {item}
                  </Button>
                ))}
              </ButtonGroup>
              <ButtonGroup aria-label="Basic button group" orientation="vertical">
                <Button variant="contained" style={{ color: '#FFF', height: 55, width: 55, borderRadius: 0 }}>
                  I
                </Button>
                {iN.map((item, key) => (
                  <Button key={'i' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
                    {item}
                  </Button>
                ))}
              </ButtonGroup>
              <ButtonGroup aria-label="Basic button group" orientation="vertical">
                <Button variant="contained" style={{ color: '#FFF', height: 55, width: 55, borderRadius: 0 }}>
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
              <ButtonGroup aria-label="Basic button group" orientation="vertical">
                <Button variant="contained" style={{ color: '#FFF', height: 55, width: 55, borderRadius: 0 }}>
                  G
                </Button>
                {gN.map((item, key) => (
                  <Button key={'g' + key} variant="outlined" style={{ height: 55, width: 55, borderRadius: 0 }}>
                    {item}
                  </Button>
                ))}
              </ButtonGroup>
              <ButtonGroup aria-label="Basic button group" orientation="vertical">
                <Button variant="contained" style={{ color: '#FFF', height: 55, width: 55, borderRadius: 0 }}>
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
                        {'Cerrar'}
                      </Button>
                    </ButtonGroup>
                  </center>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}

export default MyTickets;