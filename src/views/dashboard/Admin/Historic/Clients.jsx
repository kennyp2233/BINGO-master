/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  AppBar,
  Box,
  Toolbar,
  Grid,
  Container,
  OutlinedInput
} from '@mui/material';

//Firebase
import { db } from 'config/firebase';
import { collection, getDocs } from 'firebase/firestore';

//Notifications
import 'react-toastify/dist/ReactToastify.css';
import MessageDark from 'modules/shared/components/message/MessageDark';

function searchingData(search) {
  return function (x) {
    return x.name.toLowerCase().includes(search) || x.name.toUpperCase().includes(search) || !search;
  };
}

export default function Clients() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [search, setSearch] = React.useState('');
  const [clientsList, setClientsList] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      const list = [];
      const querySnapshot = await getDocs(collection(db, 'HistoricClients'));
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
        list.sort((a, b) => a.name.localeCompare(b.name));
      });
      setClientsList(list);
    }
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      <AppBar position="static" style={{ borderRadius: 15, height: 80, backgroundColor: '#53338a' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <h2 style={{ marginRight: 20 }}>Historico Clientes</h2>
            <Box sx={{ flexGrow: 0 }}>
              {clientsList.length > 0 ? (
                <OutlinedInput
                  id="searchField"
                  type="text"
                  name="searchField"
                  inputProps={{}}
                  onChange={(ev) => setSearch(ev.target.value)}
                  placeholder="Buscar por Razón Social"
                  style={{ width: 280 }}
                />
              ) : (
                <></>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {clientsList.length > 0 ? (
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer sx={{ maxHeight: 350 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-name" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                    Nombre / Razón Social
                  </TableCell>
                  <TableCell key="id-ci" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    C.I. / R.U.C.
                  </TableCell>
                  <TableCell key="id-mail" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                    E-mail
                  </TableCell>
                  <TableCell key="id-phone" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    Fecha Eliminación
                  </TableCell>
                  <TableCell key="id-address" align="left" style={{ minWidth: 170, fontWeight: 'bold' }}>
                    Proceso
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientsList
                  .filter(searchingData(search))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((r) => (
                    <TableRow hover key={r.id}>
                      <TableCell align="left">{r.name}</TableCell>
                      <TableCell align="left">{r.ci}</TableCell>
                      <TableCell align="left">{r.mail}</TableCell>
                      <TableCell align="left">{r.deleteAt}</TableCell>
                      <TableCell align="left">{r.action}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            labelRowsPerPage={'Registros máximos'}
            component="div"
            count={clientsList.length}
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
              <MessageDark message={'No existen registros aún!'} submessage="" />
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

