/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
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
  MenuItem,
  AppBar,
  Box,
  Toolbar,
  Typography,
  Modal,
  Grid,
  InputLabel,
  OutlinedInput,
  FormControl,
  TextField,
  ButtonGroup,
  IconButton,
  Tooltip
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { uiStyles } from './Settings.styles';

import {
  IconPlus,
  IconDeviceFloppy,
  IconTrash,
  IconEdit,
  IconCircleX,
  IconPencil,
  IconSettings,
  IconReload,
  IconSearch
} from '@tabler/icons';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Collections
import { collSettings } from 'store/collections';
import * as Msg from 'store/message';
import * as LogMsg from 'store/logsMessages';
import { generateId } from 'utils/idGenerator';
import { titles, inputLabels } from './Settings.texts';

//Utils
import { fullDate } from 'utils/validations';
import { createDocument, deleteDocument, updateDocument, createLogRecord, getParamsData } from 'config/firebaseEvents';

//types array
import { types } from 'store/typesParam';
import MessageDark from 'modules/shared/components/message/MessageDark';
import { ctaAccount, genConst } from 'store/constant';

function searchingData(search) {
  return function (x) {
    return x.name.toLowerCase().includes(search) || x.name.toUpperCase().includes(search) || !search;
  };
}

export default function Settings() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(null);

  const [id, setId] = useState(null);
  const [type, setType] = useState(null);
  const [name, setName] = useState(null);
  const [value, setValue] = useState(null);
  const [createAt, setCreateAt] = useState(null);
  const [updateAt, setUpdateAt] = useState(null);

  const [nameAccount, setNameAccount] = useState(null);
  const [ctaNumberAccount, setCtaNumberAccount] = useState(null);
  const [ctaCi, setCtaCi] = useState(null);
  const [ctaBankName, setCtaBankName] = useState(null);

  const [search, setSearch] = useState('');
  const [openLoader, setOpenLoader] = useState(false);
  const [listData, setListData] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    getParamsData().then((data) => {
      setListData(data);
    });
  }, []);

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setOpenCreate(false);
    cleanData();
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    cleanData();
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const reloadData = () => {
    getParamsData().then((data) => {
      setListData(data);
    });
  };

  const handleCreate = () => {
    if (!type) {
      toast.info(Msg.settvalreq, { position: toast.POSITION.TOP_RIGHT });
    } else {
      const ide = generateId(10);
      setOpenLoader(true);
      const obj = {
        createAt: fullDate(),
        ctaNameAccount: nameAccount,
        ctaNumberAccount: ctaNumberAccount,
        ctaCi: ctaCi,
        ctaBankName: ctaBankName,
        id: ide,
        name: name,
        value: value,
        state: 1,
        type: type,
        updateAt: null
      };
      createDocument(collSettings, ide, obj);
      createLogRecord({ details: LogMsg.logsettcre, createAt: fullDate(), object: obj });
      setTimeout(() => {
        setOpenLoader(false);
        setOpenCreate(false);
        reloadData();
        toast.success(Msg.settcresucc, { position: toast.POSITION.TOP_RIGHT });
        cleanData();
      }, 2000);
    }
  };

  const handleEdit = () => {
    if (!type) {
      toast.info(Msg.settvalreq, { position: toast.POSITION.TOP_RIGHT });
    } else {
      setOpenLoader(true);
      const obj = {
        name: name,
        value: value,
        createAt: createAt,
        ctaCi: ctaCi,
        ctaNameAccount: nameAccount,
        ctaNumberAccount: ctaNumberAccount,
        ctaBankName: ctaBankName,
        type: type,
        updateAt: fullDate()
      };
      updateDocument(collSettings, id, obj);
      createLogRecord({ details: LogMsg.logsettupd, createAt: fullDate(), object: obj });
      setTimeout(() => {
        setOpenLoader(false);
        setOpenCreate(false);
        reloadData();
        toast.success(Msg.settupdsucc, { position: toast.POSITION.TOP_RIGHT });
        cleanData();
      }, 2000);
    }
  };

  const handleDelete = () => {
    setOpenLoader(true);
    const ide = generateId(10);
    const obj = {
      action: LogMsg.logsettdel,
      createAt: createAt,
      ctaNameAccount: nameAccount,
      ctaNumberAccount: ctaNumberAccount,
      ctaCi: ctaCi,
      ctaBankName: ctaBankName,
      deleteAt: fullDate(),
      id: ide,
      name: name,
      value: value,
      state: 0,
      type: type,
      updateAt: updateAt
    };
    deleteDocument(collSettings, id, obj);
    createLogRecord({ details: LogMsg.logsettdel, createAt: fullDate(), object: obj });
    setTimeout(() => {
      setOpenLoader(false);
      setOpenDelete(false);
      reloadData();
      toast.success(Msg.settdelsucc, { position: toast.POSITION.TOP_RIGHT });
      cleanData();
    }, 2000);
  };

  const cleanData = () => {
    setType('');
    setName('');
    setValue('');
    setNameAccount('');
    setCtaNumberAccount('');
    setCtaCi('');
    setCtaBankName('');
  };

  return (
    <Box sx={uiStyles.box1}>
      <ToastContainer />
      <AppBar position="static" style={uiStyles.appbar}>
        <Toolbar>
          <IconButton color="inherit">
            <IconSettings color="#FFF" />
          </IconButton>
          <Tooltip title="Recargar">
            <IconButton
              color="inherit"
              onClick={() => {
                reloadData();
              }}
            >
              <IconReload color="#FFF" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Crear Parámetro">
            <IconButton
              color="inherit"
              onClick={() => {
                setTitle(titles.modalCreate);
                setIsEdit(false);
                cleanData();
                handleOpenCreate();
              }}
            >
              <IconPlus color="#FFF" />
            </IconButton>
          </Tooltip>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#FFF' }} align="center">
            Configuraciones
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
          {listData.length > 0 ? (
            <OutlinedInput
              id="searchField"
              type="text"
              name="searchField"
              onChange={(ev) => setSearch(ev.target.value)}
              placeholder={inputLabels.search}
              style={{ width: '100%', marginTop: 10 }}
            />
          ) : (
            <></>
          )}
        </Box>
      )}
      {listData.length > 0 ? (
        <Paper sx={uiStyles.paper}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-type" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                    {inputLabels.type}
                  </TableCell>
                  <TableCell key="id-name" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                    {inputLabels.nameVal}
                  </TableCell>
                  <TableCell key="id-value" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {inputLabels.value}
                  </TableCell>
                  <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                    {titles.actions}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listData
                  .filter(searchingData(search))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((r) => (
                    <TableRow hover key={r.id}>
                      <TableCell align="left">{r.type}</TableCell>
                      <TableCell align="left">{r.name || r.ctaBankName}</TableCell>
                      <TableCell align="left">{r.value || r.ctaNumberAccount}</TableCell>
                      <TableCell align="center">
                        <ButtonGroup variant="contained">
                          <Tooltip title="Editar">
                            <Button
                              style={{ backgroundColor: genConst.CONST_UPDATE_COLOR, color: '#FFF' }}
                              onClick={() => {
                                setId(r.id);
                                setTitle(titles.modalEdit);
                                setType(r.type);
                                setName(r.name);
                                setValue(r.value);
                                setCreateAt(r.createAt);
                                setUpdateAt(r.updateAt);
                                handleOpenCreate();
                                setIsEdit(true);
                              }}
                            >
                              <IconEdit />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <Button
                              style={{ backgroundColor: genConst.CONST_DELETE_COLOR, color: '#FFF' }}
                              onClick={() => {
                                setId(r.id);
                                setType(r.type);
                                setName(r.name);
                                setValue(r.value);
                                handleOpenDelete();
                              }}
                            >
                              <IconTrash />
                            </Button>
                          </Tooltip>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            labelRowsPerPage={titles.rowsPerPage}
            component="div"
            count={listData.length}
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
              <MessageDark message={titles.noRecordsYet} submessage="" />
            </Grid>
          </Grid>
        </Grid>
      )}

      <Modal open={openCreate} onClose={handleCloseCreate} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStyles}>
          <Typography id="modal-modal-title" variant="h3" component="h3" align="center">
            {title}
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <TextField
                      id="type"
                      name="type"
                      helperText={inputLabels.type + '*'}
                      select
                      defaultValue=""
                      onChange={(ev) => setType(ev.target.value)}
                      value={type || ''}
                    >
                      {types.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>
                {type == ctaAccount ? (
                  <>
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="nameBank">{inputLabels.nameBank}</InputLabel>
                        <OutlinedInput
                          id="nameBank"
                          type="text"
                          name="nameBank"
                          value={ctaBankName || ''}
                          inputProps={{}}
                          onChange={(ev) => setCtaBankName(ev.target.value)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="name">{inputLabels.name}</InputLabel>
                        <OutlinedInput
                          id="name"
                          type="text"
                          name="name"
                          value={nameAccount || ''}
                          inputProps={{}}
                          onChange={(ev) => setNameAccount(ev.target.value)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="ctaNumber">{inputLabels.ctaNumber}</InputLabel>
                        <OutlinedInput
                          id="ctaNumber"
                          type="text"
                          name="ctaNumber"
                          value={ctaNumberAccount || ''}
                          inputProps={{}}
                          onChange={(ev) => setCtaNumberAccount(ev.target.value)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="ctaCi">{inputLabels.ctaCi}</InputLabel>
                        <OutlinedInput
                          id="ctaCi"
                          type="number"
                          name="ctaCi"
                          value={ctaCi || ''}
                          inputProps={{}}
                          onChange={(ev) => setCtaCi(ev.target.value)}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="name">{inputLabels.nameParam}</InputLabel>
                        <OutlinedInput
                          id="name"
                          type="text"
                          name="name"
                          value={name || ''}
                          inputProps={{}}
                          onChange={(ev) => setName(ev.target.value)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="value">{inputLabels.value}</InputLabel>
                        <OutlinedInput
                          id="value"
                          type="text"
                          name="value"
                          value={value || ''}
                          inputProps={{}}
                          onChange={(ev) => setValue(ev.target.value)}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      {!isEdit ? (
                        <Button
                          variant="contained"
                          startIcon={<IconDeviceFloppy />}
                          size="large"
                          style={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF' }}
                          onClick={handleCreate}
                        >
                          {titles.buttonCreate}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<IconPencil />}
                          size="large"
                          style={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF' }}
                          onClick={handleEdit}
                        >
                          {titles.buttonEdit}
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="error"
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

      <Modal open={openDelete} onClose={handleCloseDelete} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.styleDelete}>
          <Typography id="modal-modal-title" variant="h3" component="h3" align="center">
            {titles.modalDelete}
          </Typography>
          <Typography id="modal-modal-title" variant="p" component="p" style={{ marginTop: 20, fontSize: 16 }}>
            {titles.modaleDeleteDetail} <strong>{name}</strong>
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<IconTrash />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_DELETE_COLOR, color: '#FFF' }}
                        onClick={handleDelete}
                      >
                        {titles.buttonDelete}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
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
          <Box sx={uiStyles.styleLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </Box>
  );
}

