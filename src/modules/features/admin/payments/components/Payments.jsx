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
  IconButton,
  Tooltip,
  Select,
  MenuItem
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import MessageDark from 'modules/shared/components/message/MessageDark';
import { IconTrash, IconEdit, IconCircleX, IconPencil, IconReload, IconSearch, IconPlus, IconHomeDollar } from '@tabler/icons';

import { getPaymentsListPaginated, getTotalPaidBenefit, createPayment, updatePayment } from '../services/paymentsService';
//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { genConst } from 'store/constant';
import { collPayments } from 'store/collections';
import { inputLabels, titles } from './Payments.texts';
import { uiStyles } from './Payments.styles';
//Utils
import { fullDate } from 'modules/shared/utils/validations';
import { generateId } from 'modules/shared/utils/idGenerator';

export default function Payments() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(null);

  const [id, setId] = useState(null);
  const [card, setCard] = useState(null);
  const [createAt, setCreateAt] = useState(null);
  const [details, setDetails] = useState(null);
  const [paypalOrderId, setPaypalOrderId] = useState(null);
  const [status, setStatus] = useState(null);
  const [total, setTotal] = useState(null);
  const [updateAt, setUpdateAt] = useState(null);

  const [search, setSearch] = useState('');
  const [openLoader, setOpenLoader] = useState(false);
  const [paymentsList, setPaymentsList] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [totalIncomes, setTotalIncomes] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { payments: fetchedPayments, totalCount: count } = await getPaymentsListPaginated(page, rowsPerPage, search);
      setPaymentsList(fetchedPayments);
      setTotalCount(count);

      // Actualizar el total de ingresos
      const total = await getTotalPaidBenefit();
      setTotalIncomes(Number.parseFloat(total).toFixed(2));
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Error al cargar los pagos', { position: toast.POSITION.TOP_RIGHT });
    } finally {
      setLoading(false);
    }
  };

  // Usar useEffect para manejar cambios en la paginación
  useEffect(() => {
    fetchPayments();
  }, [page, rowsPerPage]);

  // Usar useEffect separado para manejar la búsqueda con debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeoutId = setTimeout(() => {
      setPage(0); // Resetear a la primera página cuando cambia la búsqueda
      fetchPayments();
    }, 500);

    setSearchTimeout(timeoutId);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [search]);

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
    fetchPayments();
  };

  const handleSearchChange = (ev) => {
    setSearch(ev.target.value);
  };

  const handleCreate = () => {
    if (!card || !details || !total || !status) {
      toast.info(titles.require, { position: toast.POSITION.TOP_RIGHT });
    } else {
      const idd = generateId(10);
      const object = {
        id: idd,
        card: card,
        details: details,
        status: status,
        total: +total,
        createAt: fullDate(),
        // reference: details,
        paypalOrderId: paypalOrderId,
        clientTransactionId: null,
        transactionId: null
      };
      setOpenLoader(true);
      setOpenLoader(true);
      createPayment(idd, object)
        .then(() => {
          setOpenLoader(false);
          setOpenCreate(false);
          reloadData();
          toast.success(titles.successUpdate, { position: toast.POSITION.TOP_RIGHT });
          cleanData();
        })
        .catch((error) => {
          console.error('Error creating payment:', error);
          setOpenLoader(false);
          toast.error('Error al crear el pago', { position: toast.POSITION.TOP_RIGHT });
        });
    }
  };

  const handleEdit = () => {
    if (!card || !details || !total || !status) {
      toast.info(titles.require, { position: toast.POSITION.TOP_RIGHT });
    } else {
      const object = {
        card: card,
        details: details,
        status: status,
        total: total,
        paypalOrderId: null,
        updateAt: fullDate()
      };
      setOpenLoader(true);
      setOpenLoader(true);
      updatePayment(id, object)
        .then(() => {
          setOpenLoader(false);
          setOpenCreate(false);
          reloadData();
          toast.success(titles.successUpdate, { position: toast.POSITION.TOP_RIGHT });
          cleanData();
        })
        .catch((error) => {
          console.error('Error updating payment:', error);
          setOpenLoader(false);
          toast.error('Error al actualizar el pago', { position: toast.POSITION.TOP_RIGHT });
        });
    }
  };

  const handleDelete = () => {
    setOpenLoader(true);
    const object = {
      state: genConst.CONST_STA_INACT,
      deleteAt: fullDate()
    };
    updatePayment(id, object)
      .then(() => {
        setOpenLoader(false);
        setOpenDelete(false);
        reloadData();
        toast.success(titles.successDelete, { position: toast.POSITION.TOP_RIGHT });
        cleanData();
      })
      .catch((error) => {
        console.error('Error deleting payment:', error);
        setOpenLoader(false);
        toast.error('Error al eliminar el pago', { position: toast.POSITION.TOP_RIGHT });
      });
  };

  const cleanData = () => {
    setId('');
    setCard('');
    setDetails('');
    setStatus('');
    setTotal('');
    setPaypalOrderId('');
    setCreateAt('');
  };

  return (
    <Box sx={uiStyles.box}>
      <ToastContainer />
      <AppBar position="static" style={uiStyles.appbar}>
        <Toolbar>
          <IconButton color="inherit">
            <IconHomeDollar color="#FFF" />
          </IconButton>
          <Tooltip title="Agregar Pago">
            <IconButton
              color="inherit"
              onClick={() => {
                handleOpenCreate();
                cleanData();
                setIsEdit(false);
                setTitle(titles.titleCreate);
              }}
            >
              <IconPlus color="#FFF" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Recargar">
            <IconButton color="inherit" onClick={reloadData}>
              <IconReload color="#FFF" />
            </IconButton>
          </Tooltip>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#FFF' }} align="center">
            {titles.title} - ${totalIncomes || '0.00'}
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
            value={search}
            onChange={handleSearchChange}
            placeholder={inputLabels.placeHolderSearch}
            style={{ width: '100%', marginTop: 10 }}
            endAdornment={<IconSearch size={20} color="gray" />}
          />
        </Box>
      )}

      {loading ? (
        <Grid container style={{ marginTop: 20 }}>
          <Grid item xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <MessageDark message={titles.loading} submessage="" />
            </Grid>
          </Grid>
        </Grid>
      ) : paymentsList.length > 0 ? (
        <Paper sx={uiStyles.paper}>
          <TableContainer sx={{ maxHeight: '100%' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-id" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCell1}
                  </TableCell>
                  <TableCell key="id-method" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCell7}
                  </TableCell>
                  <TableCell key="id-status" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCell2}
                  </TableCell>
                  <TableCell key="id-card" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCell3}
                  </TableCell>
                  <TableCell key="id-total" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCell4}
                  </TableCell>
                  <TableCell key="id-date" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {titles.tableCell5}
                  </TableCell>
                  <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                    {titles.tableCellActions}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentsList.map((r) => (
                  <TableRow hover key={r.id}>
                    <TableCell align="left">{r.id}</TableCell>
                    <TableCell align="left">{r.provider}</TableCell>
                    <TableCell align="left">{r.status}</TableCell>
                    <TableCell align="left">{r.card}</TableCell>
                    <TableCell align="left">${r.total}</TableCell>
                    <TableCell align="left">{r.createAt}</TableCell>
                    <TableCell align="center">
                      <ButtonGroup variant="contained">
                        <Tooltip title="Editar">
                          <Button
                            style={{ backgroundColor: genConst.CONST_UPDATE_COLOR }}
                            onClick={() => {
                              setId(r.id);
                              setTitle(titles.titleUpdate);
                              setCard(r.card);
                              setDetails(r.details);
                              setStatus(r.status);
                              setTotal(r.total);
                              setPaypalOrderId(r.paypalOrderId);
                              setCreateAt(r.createAt);
                              setUpdateAt(r.updateAt);
                              handleOpenCreate();
                              setIsEdit(true);
                            }}
                          >
                            <IconEdit color="#FFF" />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <Button
                            style={{ backgroundColor: genConst.CONST_DELETE_COLOR }}
                            onClick={() => {
                              setTitle(titles.titleDelete);
                              setId(r.id);
                              setCard(r.card);
                              setDetails(r.details);
                              setStatus(r.status);
                              setTotal(r.total);
                              setPaypalOrderId(r.paypalOrderId);
                              handleOpenDelete();
                            }}
                          >
                            <IconTrash color="#FFF" />
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
            labelRowsPerPage={titles.maxRecords}
            component="div"
            count={totalCount}
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
              <MessageDark message={'No se encontraron pagos' + (search ? ' con ese criterio de búsqueda' : '')} submessage="" />
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* Modal forms - unchanged */}
      <Modal open={openCreate} onClose={handleCloseCreate} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        {/* ...existing modal content... */}
        <Box sx={uiStyles.modalStyles}>
          <Typography id="modal-modal-title" variant="h3" component="h3" align="center">
            {title}
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor={inputLabels.details}>
                      <span>*</span> {inputLabels.labelDetails}
                    </InputLabel>
                    <OutlinedInput
                      id={inputLabels.details}
                      type="text"
                      name={inputLabels.details}
                      value={details || ''}
                      inputProps={{}}
                      onChange={(ev) => setDetails(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor={inputLabels.card}>
                      <span>*</span> {inputLabels.labelCard}
                    </InputLabel>
                    <OutlinedInput
                      id={inputLabels.labelCard}
                      type="text"
                      name={inputLabels.labelCard}
                      value={card || ''}
                      inputProps={{}}
                      onChange={(ev) => setCard(ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel id={`${inputLabels.status}-label`}>{inputLabels.labelStatus}</InputLabel>
                    <Select
                      labelId={`${inputLabels.status}-label`}
                      id={inputLabels.status}
                      name={inputLabels.status}
                      value={status || ''}
                      onChange={(ev) => setStatus(ev.target.value)}
                    >
                      <MenuItem value="Aprobado">Aprobado</MenuItem>
                      <MenuItem value="Cancelado">Cancelado</MenuItem>
                      <MenuItem value="Pendiente">Pendiente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor={inputLabels.total}>
                      <span></span> {inputLabels.labelTotal}
                    </InputLabel>
                    <OutlinedInput
                      id={inputLabels.total}
                      type="number"
                      name={inputLabels.total}
                      value={total || ''}
                      inputProps={{}}
                      onChange={(ev) => setTotal(+ev.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  {/* <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor={inputLabels.paypal}>
                      <span></span> {inputLabels.labelPaypal}
                    </InputLabel>
                    <OutlinedInput
                      id={inputLabels.paypal}
                      type="text"
                      name={inputLabels.paypal}
                      value={paypalOrderId || ''}
                      inputProps={{}}
                      onChange={(ev) => setPaypalOrderId(ev.target.value)}
                    />
                  </FormControl> */}
                </Grid>
                {isEdit ? (
                  <>
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                        <span>{inputLabels.labelCreateAt}: </span> {createAt}
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                        <span>{inputLabels.labelUpdateAt}: </span> {updateAt}
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 4 }}>
                  <center>
                    <ButtonGroup>
                      {isEdit ? (
                        <Button
                          variant="contained"
                          startIcon={<IconPencil />}
                          size="large"
                          style={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF' }}
                          onClick={handleEdit}
                        >
                          {titles.buttonUpdate}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<IconPencil />}
                          size="large"
                          style={{ backgroundColor: genConst.CONST_CREATE_COLOR, color: '#FFF' }}
                          onClick={handleCreate}
                        >
                          {titles.buttonCreate}
                        </Button>
                      )}
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
            {titles.titleDeleteModal} <strong>{id}</strong>
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
                        onClick={handleDelete}
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

