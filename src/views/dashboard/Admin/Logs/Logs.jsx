/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  OutlinedInput,
  ButtonGroup,
  IconButton,
  Tooltip
} from '@mui/material';
import { uiStyles } from './Logs.styles';
import { JsonViewer } from '@textea/json-viewer';
import { IconCircleX, IconReload, IconSearch, IconEyeTable, IconFile } from '@tabler/icons';
import { titles, inputLabels } from './Logs.texts';
import { getLogsData } from 'config/firebaseEvents';
import MessageDark from 'modules/shared/components/message/MessageDark';
import { genConst } from 'store/constant';

// Optimized search function
const searchingData = (search = '') => {
  const normalizedSearch = search.trim().toLowerCase();
  return (x) => x?.collection?.toLowerCase()?.includes(normalizedSearch);
};

export default function Logs() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreate, setOpenCreate] = useState(false);
  const [title, setTitle] = useState(null);
  const [object, setObject] = useState(null);
  const [search, setSearch] = useState('');
  const [listData, setListData] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  // Load data once
  useEffect(() => {
    getLogsData().then(setListData);
  }, []);

  // Memoized search result
  const filteredData = useMemo(() => listData.filter(searchingData(search)), [listData, search]);

  // Handlers
  const handleOpenCreate = useCallback(() => setOpenCreate(true), []);
  const handleCloseCreate = useCallback(() => setOpenCreate(false), []);
  const handleChangePage = useCallback((_, newPage) => setPage(newPage), []);
  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }, []);
  const reloadData = useCallback(() => {
    getLogsData().then(setListData);
  }, []);

  return (
    <Box sx={uiStyles.box1}>
      <AppBar position="static" style={uiStyles.appbar}>
        <Toolbar>
          <IconButton color="inherit">
            <IconFile color="#FFF" />
          </IconButton>
          <Tooltip title="Recargar">
            <IconButton color="inherit" onClick={reloadData}>
              <IconReload color="#FFF" />
            </IconButton>
          </Tooltip>
          <Typography variant="h5" sx={{ flexGrow: 1, color: '#FFF' }} align="center">
            Logs del Sistema
          </Typography>
          <Tooltip title="Buscar">
            <IconButton color="inherit" onClick={() => setShowSearch((prev) => !prev)}>
              <IconSearch color="#FFF" />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Search Bar */}
      {showSearch && (
        <Box sx={{ flexGrow: 0 }}>
          {!!listData.length && (
            <OutlinedInput
              id="searchField"
              type="text"
              name="searchField"
              value={search}
              onChange={(ev) => setSearch(ev.target.value)}
              placeholder={inputLabels.search}
              fullWidth
              sx={{ mt: 2 }}
            />
          )}
        </Box>
      )}

      {listData.length ? (
        <Paper sx={uiStyles.paper}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {['Colección', 'Fecha', 'LogId', titles.actions].map((header) => (
                    <TableCell
                      key={header}
                      align={header === titles.actions ? 'center' : 'left'}
                      sx={{ minWidth: 100, fontWeight: 'bold' }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow hover key={row.id}>
                    <TableCell align="left">{row.collection}</TableCell>
                    <TableCell align="left">{row.createAt}</TableCell>
                    <TableCell align="left">{row.id}</TableCell>
                    <TableCell align="center">
                      <ButtonGroup variant="contained">
                        <Tooltip title="Ver Objeto">
                          <Button
                            sx={{ bgcolor: genConst.CONST_UPDATE_COLOR, color: '#FFF' }}
                            onClick={() => {
                              setObject(row.object);
                              setTitle('Objeto Detalle');
                              handleOpenCreate();
                            }}
                          >
                            <IconEyeTable />
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
        <Grid container sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <MessageDark message={titles.noRecordsYet} />
          </Grid>
        </Grid>
      )}

      {/* Modal for Object Details */}
      <Modal open={openCreate} onClose={handleCloseCreate} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStyles}>
          <Typography variant="h3" align="center">
            {title}
          </Typography>
          <Grid container sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <JsonViewer value={object} />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
              <ButtonGroup>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<IconCircleX />}
                  sx={{ bgcolor: genConst.CONST_CANCEL_COLOR, color: '#FFF' }}
                  onClick={handleCloseCreate}
                >
                  {titles.buttonCancel}
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
}

