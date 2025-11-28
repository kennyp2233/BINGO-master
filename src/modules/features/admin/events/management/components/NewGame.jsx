import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Box,
  Typography,
  Modal,
  Grid,
  InputLabel,
  OutlinedInput,
  FormControl,
  ButtonGroup,
  IconButton,
  Toolbar,
  AppBar,
  Tooltip,
  Select,
  MenuItem
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import MessageDark from 'modules/shared/components/message/MessageDark';
import { IconTrash, IconEdit, IconCircleX, IconDeviceFloppy, IconPlus, IconCalendar, IconSearch } from '@tabler/icons';
//Firebase Events
import { createDocument, deleteDocument, updateDocument } from 'modules/shared/services/firebaseCommon';
import { getAllGamesList, getGamesList } from 'modules/features/admin/events';
//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { bingoValues, genConst } from 'store/constant';
import { collGames } from 'store/collections';
import { inputLabels, titles } from '../../management/management.texts';
import { uiStyles } from '../../management/management.styles';
//Utils
import { fullDate } from 'utils/validations';
import { generateId } from 'utils/idGenerator';
import { searchingGameData } from 'utils/search';

export default function NewGame() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  const [price, setPrice] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [transmition, setTransmition] = useState(null);
  const [state, setState] = useState(0);
  const [gameList, setGameList] = useState([]);
  const [openLoader, setOpenLoader] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const regex = /^[0-9]*\.?[0-9]{0,2}$/;

  useEffect(() => {
    getAllGamesList().then((data) => {
      setGameList(data);
    });
  }, []);

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setOpenCreate(false);
    cleanData();
  };

  const handleOpenEdit = () => {
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
    cleanData();
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const reloadData = () => {
    getGamesList().then((data) => {
      setGameList(data);
    });
  };

  const handleCreateGame = () => {
    if (!name) {
      toast.info(titles.require, { position: toast.POSITION.TOP_RIGHT });
    } else if (!regex.test(price)) {
      toast.info('Ingrese un precio válido ej: (19.99)', { position: toast.POSITION.TOP_RIGHT });
      setPrice('');
    } else {
      const ide = generateId(10);
      const object = {
        ide: ide,
        name: name,
        startDate: startDate,
        price: price,
        transmition: transmition,
        createAt: fullDate(),
        state: 0
      };
      setOpenLoader(true);
      createDocument(collGames, ide, object);
      console.log(object);
      setTimeout(() => {
        setOpenLoader(false);
        setOpenCreate(false);
        cleanData();
        reloadData();
        toast.success(titles.successUpdate, { position: toast.POSITION.TOP_RIGHT });
      }, 2000);
    }
  };

  const handleEditGame = () => {
    if (!name) {
      toast.info(titles.require, { position: toast.POSITION.TOP_RIGHT });
    } else if (!regex.test(price)) {
      toast.info('Ingrese un precio válido ej: (19.99)', { position: toast.POSITION.TOP_RIGHT });
      setPrice('');
    } else {
      const object = {
        name: name,
        startDate: startDate,
        price: price,
        transmition: transmition,
        updateAt: fullDate(),
        state: state
      };
      setOpenLoader(true);
      updateDocument(collGames, id, object);
      console.log(object);
      setTimeout(() => {
        setOpenLoader(false);
        setOpenEdit(false);
        cleanData();
        reloadData();
        toast.success(titles.successUpdate, { position: toast.POSITION.TOP_RIGHT });
      }, 2000);
    }
  };

  const handleDeleteUser = () => {
    setOpenLoader(true);
    deleteDocument(collGames, id);
    setTimeout(() => {
      setOpenLoader(false);
      setOpenDelete(false);
      reloadData();
      toast.success(titles.successDelete, { position: toast.POSITION.TOP_RIGHT });
      cleanData();
    }, 2000);
  };

  const cleanData = () => {
    setName('');
    setStartDate('');
    setPrice('');
    setState(0);
    setTransmition('');
  };

  return (
    <Box sx={uiStyles.box}>
      <ToastContainer />
      <AppBar position="static" style={uiStyles.appbar}>
        <Toolbar>
          <IconButton color="inherit">
            <IconCalendar color="#FFF" />
          </IconButton>
          <Tooltip title="Crear Evento">
            <IconButton
              color="inherit"
              onClick={() => {
                handleOpenCreate();
              }}
            >
              <IconPlus color="#FFF" />
            </IconButton>
          </Tooltip>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#FFF' }} align="center">
            Eventos
          </Typography>
          <Tooltip title="Buscar">
            <IconButton
              color="inherit"
              onClick={() => {
                setShowSearch(!showSearch);
              }}
            >
              <IconSearch color="#FFF" />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      {showSearch && (
        <Box sx={{ flexGrow: 0 }}>
          {gameList.length > 0 ? (
            <OutlinedInput
              id={inputLabels.search}
              type="text"
              name={inputLabels.search}
              onChange={(ev) => setSearch(ev.target.value)}
              placeholder={inputLabels.placeHolderSearch}
              style={{ width: '100%', marginTop: 10 }}
            />
          ) : (
            <></>
          )}
        </Box>
      )}
      {gameList.length > 0 ? (
        <Paper style={{ marginTop: 10 }}>
          <TableContainer sx={{ maxHeight: '100%' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-id" align="left" style={{ minWidth: 70, fontWeight: 'bold' }}>
                    ID
                  </TableCell>
                  <TableCell key="id-name" align="left" style={{ minWidth: 200, fontWeight: 'bold' }}>
                    Nombre
                  </TableCell>
                  <TableCell key="id-State" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    Estado
                  </TableCell>
                  <TableCell key="id-price" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    Precio
                  </TableCell>
                  <TableCell key="id-date" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    Fecha
                  </TableCell>
                  <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                    {titles.tableCellActions}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gameList
                  .filter(searchingGameData(search))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((r, index) => (
                    <TableRow hover key={index}>
                      <TableCell align="left">{r.ide}</TableCell>
                      <TableCell align="left">{r.name}</TableCell>
                      <TableCell align="left">
                        {r.state === 0 ? (
                          <span style={{ color: genConst.CONST_INFO_COLOR, fontWeight: 'bold' }}>{bingoValues.STATE_EV_INC}</span>
                        ) : r.state === 1 ? (
                          <span style={{ color: genConst.CONST_SUCCESS_COLOR, fontWeight: 'bold' }}>{bingoValues.STATE_EV_ACT}</span>
                        ) : (
                          <span style={{ color: genConst.CONST_ERROR_COLOR, fontWeight: 'bold' }}>{bingoValues.STATE_EV_END}</span>
                        )}
                      </TableCell>
                      <TableCell align="left">$ {r.price}</TableCell>
                      <TableCell align="left">{r.startDate}</TableCell>
                      <TableCell align="center">
                        <ButtonGroup variant="contained">
                          <Tooltip title="Editar">
                            <Button
                              style={{ backgroundColor: genConst.CONST_UPDATE_COLOR }}
                              onClick={() => {
                                setId(r.ide);
                                setName(r.name);
                                setPrice(r.price);
                                setState(r.state);
                                setStartDate(r.startDate);
                                setTransmition(r.transmition);
                                handleOpenEdit();
                              }}
                            >
                              <IconEdit color="#FFF" />
                            </Button>
                          </Tooltip>
                          {/* <Tooltip title="Eliminar">
                            <Button
                              style={{ backgroundColor: genConst.CONST_DELETE_COLOR }}
                              onClick={() => {
                                setId(r.ide);
                                setName(r.name);
                                setPrice(r.price);
                                setStartDate(r.startDate);
                                handleOpenDelete();
                              }}
                            >
                              <IconTrash color="#FFF" />
                            </Button>
                          </Tooltip> */}
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            labelRowsPerPage={titles.maxRecords}
            component="div"
            count={gameList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <Grid container style={{ marginTop: 20 }}>
          <Grid item xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <MessageDark message={titles.loading} submessage="" />
            </Grid>
          </Grid>
        </Grid>
      )}

      <Modal open={openCreate} onClose={handleCloseCreate} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStyles}>
          <Typography id="modal-modal-title" variant="h3" component="h3" align="center">
            Crear nuevo evento
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <InputLabel id={inputLabels.name}>* {inputLabels.labelName}</InputLabel>
                  <FormControl fullWidth>
                    <OutlinedInput
                      id={inputLabels.name}
                      type="text"
                      name={inputLabels.name}
                      value={name || ''}
                      inputProps={{}}
                      onChange={(ev) => setName(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <InputLabel id={'startDate'}>* {'Fecha'}</InputLabel>
                  <FormControl fullWidth>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={startDate || ''}
                      onChange={(ev) => setStartDate(ev.target.value)}
                      style={uiStyles.dateInput}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <InputLabel id={inputLabels.state}>* {inputLabels.labelState}</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      labelId={inputLabels.state}
                      id={inputLabels.state}
                      label={inputLabels.labelState}
                      onChange={(ev) => setState(ev.target.value)}
                    >
                      <MenuItem value={genConst.CONST_STA_ACT}>{genConst.CONST_STA_ACT_TXT}</MenuItem>
                      <MenuItem value={genConst.CONST_STA_INACT}>{genConst.CONST_STA_INACT_TXT}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <InputLabel id={inputLabels.price}>* {inputLabels.labelPrice}</InputLabel>
                  <FormControl fullWidth>
                    <OutlinedInput
                      id={inputLabels.price}
                      type="text"
                      name={inputLabels.price}
                      value={price || ''}
                      inputProps={{}}
                      onChange={(ev) => setPrice(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <InputLabel id={'transmition'}>* {'Link Transmisión:'}</InputLabel>
                  <FormControl fullWidth>
                    <input
                      type="text"
                      id="transmition"
                      name="transmition"
                      value={transmition || ''}
                      onChange={(ev) => setTransmition(ev.target.value)}
                      style={uiStyles.dateInput}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={<IconDeviceFloppy />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF' }}
                        onClick={handleCreateGame}
                      >
                        {titles.buttonCreate}
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<IconCircleX />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_CANCEL_COLOR, color: '#FFF' }}
                        onClick={handleCloseCreate}
                      >
                        {titles.buttonCancel}
                      </Button>
                    </ButtonGroup>
                  </center>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Modal open={openEdit} onClose={handleCloseEdit} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStyles}>
          <Typography id="modal-modal-title" variant="h3" component="h3" align="center">
            Editar evento
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <InputLabel id={inputLabels.name}>* {inputLabels.labelName}</InputLabel>
                  <FormControl fullWidth>
                    <OutlinedInput
                      id={inputLabels.name}
                      type="text"
                      name={inputLabels.name}
                      value={name || ''}
                      inputProps={{}}
                      onChange={(ev) => setName(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <InputLabel id={'startDate'}>* {'Fecha'}</InputLabel>
                  <FormControl fullWidth>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={startDate || ''}
                      onChange={(ev) => setStartDate(ev.target.value)}
                      style={uiStyles.dateInput}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <InputLabel id={inputLabels.state}>* {inputLabels.labelState}</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      labelId={inputLabels.state}
                      id={inputLabels.state}
                      value={state}
                      label={inputLabels.labelState}
                      onChange={(ev) => setState(ev.target.value)}
                    >
                      <MenuItem value={genConst.CONST_STA_ACT}>{genConst.CONST_STA_ACT_TXT}</MenuItem>
                      <MenuItem value={genConst.CONST_STA_INACT}>{genConst.CONST_STA_INACT_TXT}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <InputLabel id={inputLabels.price}>* {inputLabels.labelPrice}</InputLabel>
                  <FormControl fullWidth>
                    <OutlinedInput
                      id={inputLabels.price}
                      type="text"
                      name={inputLabels.price}
                      value={price}
                      onChange={(ev) => setPrice(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <InputLabel id={'transmition'}>* {'Link Transmisión:'}</InputLabel>
                  <FormControl fullWidth>
                    <input
                      type="text"
                      id="transmition"
                      name="transmition"
                      value={transmition || ''}
                      onChange={(ev) => setTransmition(ev.target.value)}
                      style={uiStyles.dateInput}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={<IconDeviceFloppy />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF' }}
                        onClick={handleEditGame}
                      >
                        {titles.buttonUpdate}
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<IconCircleX />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_CANCEL_COLOR, color: '#FFF' }}
                        onClick={handleCloseEdit}
                      >
                        {titles.buttonCancel}
                      </Button>
                    </ButtonGroup>
                  </center>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Modal open={openDelete} onClose={handleCloseDelete} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStylesDelete}>
          <Typography id="modal-modal-title" variant="h3" component="h3" align="center">
            Eliminar Evento
          </Typography>
          <Typography id="modal-modal-title" variant="p" component="p" style={{ marginTop: 20, fontSize: 16 }}>
            {titles.titleDeleteModal} <strong>{name}</strong> {' programada para el: ' + startDate}
          </Typography>
          <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={<IconTrash />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_DELETE_COLOR, color: '#FFF' }}
                        onClick={handleDeleteUser}
                      >
                        {titles.buttonDelete}
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<IconCircleX />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_CANCEL_COLOR, color: '#FFF' }}
                        onClick={handleCloseDelete}
                      >
                        {titles.buttonCancel}
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
    </Box>
  );
}

