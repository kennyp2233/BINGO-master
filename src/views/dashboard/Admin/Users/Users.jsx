import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
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
  ButtonGroup,
  Select,
  IconButton,
  Tooltip
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import User1 from 'assets/images/profile/profile-picture-6.jpg';
import MessageDark from 'modules/shared/components/message/MessageDark';
import { IconTrash, IconEdit, IconCircleX, IconPencil, IconReload, IconUserCircle, IconSearch, IconFileAnalytics } from '@tabler/icons';
//Firebase Events
import { createDocument, updateDocument } from 'config/firebaseEvents';
import { getUsersListPaginated } from 'modules/features/admin/users';
//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { genConst } from 'store/constant';
import { collHistUsr, collUsers } from 'store/collections';
import { inputLabels, titles } from './Users.texts';
import { uiStyles } from './Users.styles';
//Utils
import { fullDate } from 'modules/shared/utils/validations';
import { generateId } from 'modules/shared/utils/idGenerator';
import { useNavigate } from 'react-router';

export default function Users() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(null);

  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEMail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [profile, setProfile] = useState(null);
  const [state, setState] = useState(null);
  const [createAt, setCreateAt] = useState(null);
  const [updateAt, setUpdateAt] = useState(null);

  const [search, setSearch] = useState('');
  const [openLoader, setOpenLoader] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [page, rowsPerPage, search]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const result = await getUsersListPaginated(page, rowsPerPage, search);
      setUsersList(result.users);
      setTotalUsers(result.totalCount);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar usuarios', { position: toast.POSITION.TOP_RIGHT });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setOpenCreate(false);
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
    setPage(0);
    loadUsers();
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(0); // Reset to first page when searching
  };

  const handleEditUser = () => {
    if (!name || !lastName || !phone || !profile || !state) {
      toast.info(titles.require, { position: toast.POSITION.TOP_RIGHT });
    } else {
      const object = {
        name: name,
        lastName: lastName,
        fullName: (name + ' ' + lastName).toLowerCase(), // Add fullName for search
        state: state,
        phone: phone,
        profile: profile,
        updateAt: fullDate()
      };
      setOpenLoader(true);
      updateDocument(collUsers, id, object);
      setTimeout(() => {
        setOpenLoader(false);
        setOpenCreate(false);
        reloadData();
        toast.success(titles.successUpdate, { position: toast.POSITION.TOP_RIGHT });
        cleanData();
      }, 2000);
    }
  };

  const handleDeleteUser = () => {
    setOpenLoader(true);
    const usrHistId = generateId(10);
    const objectHist = {
      action: titles.labelDelete,
      createAt: createAt,
      deleteAt: fullDate(),
      email: email,
      phone: phone,
      id: usrHistId,
      name: name + ' ' + lastName,
      state: genConst.CONST_STA_INACT,
      updateAt: updateAt
    };
    const object = {
      state: genConst.CONST_STA_INACT,
      deleteAt: fullDate()
    };
    updateDocument(collUsers, id, object);
    createDocument(collHistUsr, usrHistId, objectHist);
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
    setLastName('');
    setPhone('');
    setEMail('');
    setProfile('');
    setState('');
  };

  const handleGameClick = (userId) => {
    navigate(`/main/users-cards/${userId}`);
  };

  return (
    <Box sx={uiStyles.box}>
      <ToastContainer />
      <AppBar position="static" style={uiStyles.appbar}>
        <Toolbar>
          <IconButton color="inherit">
            <IconUserCircle color="#FFF" />
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
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#FFF' }} align="center">
            Usuarios
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
          <OutlinedInput
            id={inputLabels.search}
            type="text"
            name={inputLabels.search}
            onChange={(ev) => handleSearch(ev.target.value)}
            placeholder={inputLabels.placeHolderSearch}
            style={{ width: '100%', marginTop: 10 }}
          />
        </Box>
      )}
      {isLoading ? (
        <Grid container style={{ marginTop: 20 }}>
          <Grid item xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <MessageDark message={titles.loading} submessage="" />
            </Grid>
          </Grid>
        </Grid>
      ) : usersList.length > 0 ? (
        <Paper sx={uiStyles.paper}>
          <TableContainer sx={{ maxHeight: '100%' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-name" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCell1}
                  </TableCell>
                  <TableCell key="id-email" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCell2}
                  </TableCell>
                  <TableCell key="id-phone" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCellP}
                  </TableCell>
                  <TableCell key="id-profile" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCell3}
                  </TableCell>
                  <TableCell key="id-provider" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCell5}
                  </TableCell>
                  <TableCell key="id-state" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCell4}
                  </TableCell>
                  <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                    {titles.tableCellActions}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersList.map((r) => (
                  <TableRow hover key={r.id}>
                    <TableCell align="left">
                      <ButtonGroup>
                        <Avatar src={r.avatar || User1} color="inherit" style={{ width: 32, height: 32 }} />
                        <span style={{ margin: 6 }}>{r.name + ' ' + r.lastName}</span>
                      </ButtonGroup>
                    </TableCell>
                    <TableCell align="left">{r.email}</TableCell>
                    <TableCell align="left">{r.phone}</TableCell>
                    <TableCell align="left">
                      {r.profile === genConst.CONST_PRO_ADM ? genConst.CONST_PRO_ADM_TXT : genConst.CONST_PRO_STU_TXT}
                    </TableCell>
                    <TableCell align="left">{r.provider}</TableCell>
                    <TableCell align="left">
                      {r.state === genConst.CONST_STA_ACT ? genConst.CONST_STA_ACT_TXT : genConst.CONST_STA_INACT_TXT}
                    </TableCell>
                    <TableCell align="center">
                      <ButtonGroup variant="contained">
                        <Tooltip title="Editar">
                          <Button
                            style={{ backgroundColor: genConst.CONST_UPDATE_COLOR }}
                            onClick={() => {
                              setId(r.id);
                              setTitle(titles.titleUpdate);
                              setName(r.name);
                              setLastName(r.lastName);
                              setEMail(r.email);
                              setPhone(r.phone);
                              setProfile(r.profile);
                              setState(r.state);
                              setCreateAt(r.createAt);
                              setUpdateAt(r.updateAt);
                              handleOpenCreate();
                              setIsEdit(true);
                            }}
                          >
                            <IconEdit color="#FFF" />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Ver Cartillas">
                          <Button style={{ backgroundColor: genConst.CONST_CREATE_COLOR }} onClick={() => handleGameClick(r.id)}>
                            <IconFileAnalytics color="#FFF" />
                          </Button>
                        </Tooltip>
                        {/* <Tooltip title="Eliminar">
                          <Button
                            style={{ backgroundColor: genConst.CONST_DELETE_COLOR }}
                            onClick={() => {
                              setTitle(titles.titleDelete);
                              setId(r.id);
                              setName(r.name);
                              setLastName(r.lastName);
                              setEMail(r.email);
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
            count={totalUsers}
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
              <MessageDark message={search ? 'No se encontraron usuarios con ese criterio' : titles.loading} submessage="" />
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
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="name">
                      <span>*</span> {inputLabels.labelName}
                    </InputLabel>
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
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="lastName">
                      <span>*</span> {inputLabels.labelLastName}
                    </InputLabel>
                    <OutlinedInput
                      id={inputLabels.labelLastName}
                      type="text"
                      name={inputLabels.labelLastName}
                      value={lastName || ''}
                      inputProps={{}}
                      onChange={(ev) => setLastName(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="email">
                      <span></span> {inputLabels.labelEmail}
                    </InputLabel>
                    <OutlinedInput
                      id={inputLabels.email}
                      type="email"
                      name={inputLabels.email}
                      value={email || ''}
                      inputProps={{}}
                      onChange={(ev) => setEMail(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="phone">
                      <span></span> {inputLabels.phone}
                    </InputLabel>
                    <OutlinedInput
                      id={inputLabels.phone}
                      type="number"
                      name={inputLabels.phone}
                      value={phone || ''}
                      inputProps={{}}
                      onChange={(ev) => setPhone(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id={inputLabels.profile}>* {inputLabels.labelProfile}</InputLabel>
                    <Select
                      labelId={inputLabels.profile}
                      id={inputLabels.profile}
                      value={profile}
                      label={inputLabels.labelProfile}
                      onChange={(ev) => setProfile(ev.target.value)}
                    >
                      <MenuItem value={genConst.CONST_PRO_ADM}>{genConst.CONST_PRO_ADM_TXT}</MenuItem>
                      <MenuItem value={genConst.CONST_PRO_DEF}>{genConst.CONST_PRO_STU_TXT}</MenuItem>
                      <MenuItem value={genConst.CONST_PRO_ADM_BING}>{genConst.CONST_PRO_ADM_BING_TXT}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id={inputLabels.state}>* {inputLabels.labelState}</InputLabel>
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
                {isEdit ? (
                  <Grid item lg={6} md={6} sm={6} xs={6} style={{ marginBottom: 30 }}>
                    <FormControl fullWidth>
                      <InputLabel>
                        <strong>Usuario desde: </strong>
                        {createAt}
                      </InputLabel>
                    </FormControl>
                  </Grid>
                ) : (
                  <></>
                )}
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={<IconPencil />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF' }}
                        onClick={handleEditUser}
                      >
                        {titles.buttonUpdate}
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

      <Modal open={openDelete} onClose={handleCloseDelete} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStylesDelete}>
          <Typography id="modal-modal-title" variant="h3" component="h3" align="center">
            {title}
          </Typography>
          <Typography id="modal-modal-title" variant="p" component="p" style={{ marginTop: 20, fontSize: 16 }}>
            {titles.titleDeleteModal} <strong>{name}</strong>
          </Typography>
          <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={<IconTrash size={20} />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_DELETE_COLOR, color: '#FFF' }}
                        onClick={handleDeleteUser}
                      >
                        {titles.buttonDelete}
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<IconCircleX size={20} />}
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

