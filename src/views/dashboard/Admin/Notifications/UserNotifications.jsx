import React, { useState, useEffect } from 'react';

import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, IconButton, MenuItem, Paper, Avatar, Tooltip } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import { ButtonGroup, Button, Grid, Modal, Box, FormControl, OutlinedInput, TextField } from '@mui/material';
import { IconCircleX, IconDeviceFloppy, IconEdit, IconNotification, IconPlus, IconTrash } from '@tabler/icons';
import { uiStyles } from './Notifications.styles';
import MessageDark from 'modules/shared/components/message/MessageDark';
import { collUsers, collUsrNoti } from 'store/collections';
import { createDocument, getDocuments, getUserName, updateDocument, deleteDocument } from 'config/firebaseEvents';
import { genConst } from 'store/constant';
import { titles, inputLabels } from './Notifications.texts';
import CircularProgress from '@mui/material/CircularProgress';
import User1 from 'assets/images/profile/profile-picture-6.jpg';

//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import * as Msg from 'store/message';
import { generateId } from 'utils/idGenerator';
import { fullDate, getCurrentHourFormatted } from 'utils/validations';

const UserNotifications = () => {
  const theme = useTheme();
  const [dataList, setDataList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [notId, setNotId] = useState(null);

  const getData = async () => {
    const list = [];
    const querySnapshot = await getDocuments(collUsrNoti);
    querySnapshot.forEach((doc) => {
      list.push(doc.data());
    });
    setDataList(list);
  };

  const getUsers = async () => {
    const list = [];
    const querySnapshot = await getDocuments(collUsers);
    querySnapshot.forEach((doc) => {
      list.push(doc.data());
    });
    setUserList(list);
  };

  useEffect(() => {
    getData();
    getUsers();
  }, []);

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setOpenCreate(false);
    setMessage(null);
  };

  const handleOpenEdit = () => {
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setMessage(null);
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

  const handleCreate = () => {
    if (!message) {
      toast.info(Msg.notcreinf, { position: toast.POSITION.TOP_RIGHT });
    } else {
      setOpenLoader(true);
      const notificationId = generateId(10);
      const object = {
        id: notificationId,
        avatar: null,
        message: message,
        idUser: user,
        userName: userName,
        by: genConst.CONST_ADM_NOT,
        createAt: fullDate(),
        hourAt: getCurrentHourFormatted(),
        state: genConst.CONST_STA_ACT
      };
      createDocument(collUsrNoti, notificationId, object);
      setTimeout(() => {
        setOpenLoader(false);
        setOpenCreate(false);
        getData();
        setMessage(null);
        toast.success(Msg.notcresucc, { position: toast.POSITION.TOP_RIGHT });
      }, 2000);
    }
  };

  const handleChange = (e) => {
    getUserName(e.target.value)
      .then((user) => {
        setUserName(user);
      })
      .catch((error) => {
        console.log(error);
      });
    setUser(e.target.value);
  };

  const handleEdit = () => {
    if (!message) {
      toast.info(Msg.notcreinf, { position: toast.POSITION.TOP_RIGHT });
    } else {
      setOpenLoader(true);
      const object = {
        message: message,
        updateAt: fullDate()
      };
      updateDocument(collUsrNoti, notId, object);
      setTimeout(() => {
        setOpenLoader(false);
        setOpenEdit(false);
        getData();
        setMessage(null);
        toast.success(Msg.notupdsucc, { position: toast.POSITION.TOP_RIGHT });
      }, 2000);
    }
  };

  const handleDelete = () => {
    setOpenLoader(true);
    deleteDocument(collUsrNoti, notId);
    setTimeout(() => {
      setOpenLoader(false);
      setOpenDelete(false);
      getData();
      setMessage(null);
      toast.success(Msg.notdelsucc, { position: toast.POSITION.TOP_RIGHT });
    }, 2000);
  };

  return (
    <div>
      <ToastContainer />
      <AppBar position="static" style={uiStyles.appbar}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu">
            <IconNotification color="#FFF" />
          </IconButton>
          <Tooltip title="Crear Notificación">
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
            Notificaciones
          </Typography>
        </Toolbar>
      </AppBar>
      {dataList.length > 0 ? (
        <Paper sx={uiStyles.paper}>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-col1" align="left" style={{ minWidth: 40, fontWeight: 'bold' }}>
                    {inputLabels.tableCol1}
                  </TableCell>
                  <TableCell key="id-col2" align="left" style={{ minWidth: 160, fontWeight: 'bold' }}>
                    {inputLabels.tableCol2}
                  </TableCell>
                  <TableCell key="id-col3" align="left" style={{ minWidth: 140, fontWeight: 'bold' }}>
                    {inputLabels.tableCol3}
                  </TableCell>
                  <TableCell key="id-col4" align="left" style={{ minWidth: 120, fontWeight: 'bold' }}>
                    {inputLabels.tableCol4}
                  </TableCell>
                  <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                    {inputLabels.actions}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
                  <TableRow hover key={r.id}>
                    <TableCell align="left">
                      <Avatar src={r.avatar || User1} color="inherit" style={{ width: 28, height: 28 }} />
                    </TableCell>
                    <TableCell align="left">{r.message}</TableCell>
                    <TableCell align="left">{r.userName}</TableCell>
                    <TableCell align="left">{r.createAt}</TableCell>
                    <TableCell align="center">
                      <ButtonGroup variant="contained">
                        <Button
                          style={{ backgroundColor: genConst.CONST_UPDATE_COLOR }}
                          onClick={() => {
                            setMessage(r.message);
                            setNotId(r.id);
                            handleOpenEdit();
                          }}
                        >
                          <IconEdit />
                        </Button>
                        <Button
                          style={{ backgroundColor: genConst.CONST_DELETE_COLOR }}
                          onClick={() => {
                            setNotId(r.id);
                            handleOpenDelete();
                          }}
                        >
                          <IconTrash />
                        </Button>
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
            count={dataList.length}
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
            {titles.modalCreate}
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <OutlinedInput
                      id={inputLabels.message}
                      type="text"
                      multiline
                      rows={4}
                      name={inputLabels.message}
                      value={message || ''}
                      placeholder={inputLabels.labelMessage}
                      onChange={(ev) => setMessage(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <FormControl fullWidth>
                    <TextField id="users" name="users" select label="* Selecciona el Usuario" defaultValue="" onChange={handleChange}>
                      {userList.map((option) => (
                        <MenuItem key={option.id} value={option.id} name={option.name + ' ' + option.lastName}>
                          {option.name + ' ' + option.lastName}
                        </MenuItem>
                      ))}
                    </TextField>
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
                        onClick={handleCreate}
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
            {titles.modalEdit}
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <OutlinedInput
                      id={inputLabels.message}
                      type="text"
                      multiline
                      rows={4}
                      name={inputLabels.message}
                      value={message || ''}
                      placeholder={inputLabels.labelMessage}
                      onChange={(ev) => setMessage(ev.target.value)}
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
                        style={{ backgroundColor: genConst.CONST_UPDATE_COLOR, color: '#FFF' }}
                        onClick={handleEdit}
                      >
                        {titles.buttonEdit}
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
        <Box sx={uiStyles.styleDelete}>
          <Typography id="modal-modal-title" variant="h3" component="h3" align="center">
            {titles.modalDelete}
          </Typography>
          <Typography id="modal-modal-title" variant="p" component="p" style={uiStyles.modalDeleteTitle}>
            {titles.modaleDeleteDetail}
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
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
                        onClick={handleDelete}
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
          <Box sx={uiStyles.styleLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </div>
  );
};

export default UserNotifications;

