import React, { useState, useEffect } from 'react';
import { Paper, Tooltip } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import { Button, Grid, Modal, Box } from '@mui/material';
import { IconMessage2 } from '@tabler/icons';
import { uiStyles } from './Mail.styles';
import MessageDark from 'modules/shared/components/message/MessageDark';
import { collMail } from 'store/collections';
import { getMail, updateDocument } from 'config/firebaseEvents';
import { genConst } from 'store/constant';
import { titles, inputLabels } from './Mail.text';
import CircularProgress from '@mui/material/CircularProgress';
//Notifications
import 'react-toastify/dist/ReactToastify.css';
import { fullDate } from 'modules/shared/utils/validations';

const Mail = () => {
  const [dataList, setDataList] = useState([]);
  const [openLoader, setOpenLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getMail().then((data) => {
      setDataList(data);
    });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (id) => {
    setOpenLoader(true);
    const object = {
      updateAt: fullDate(),
      state: 0
    };
    updateDocument(collMail, id, object);
    setTimeout(() => {
      setOpenLoader(false);
    }, 2000);
  };

  return (
    <div>
      {dataList.length > 0 ? (
        <Paper sx={uiStyles.paper}>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-col1" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {inputLabels.tableCol1}
                  </TableCell>
                  <TableCell key="id-col2" align="left" style={{ minWidth: 140, fontWeight: 'bold' }}>
                    {inputLabels.tableCol2}
                  </TableCell>
                  <TableCell key="id-col3" align="left" style={{ minWidth: 200, fontWeight: 'bold' }}>
                    {inputLabels.tableCol3}
                  </TableCell>
                  <TableCell key="id-col4" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    {inputLabels.tableCol4}
                  </TableCell>
                  <TableCell key="id-col5" align="left" style={{ minWidth: 120, fontWeight: 'bold' }}>
                    {inputLabels.tableCol5}
                  </TableCell>
                  <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                    {inputLabels.actions}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
                  <TableRow hover key={r.id}>
                    <TableCell align="left">{r.name + ' ' + r.email}</TableCell>
                    <TableCell align="left">{r.subject}</TableCell>
                    <TableCell align="left">{r.message}</TableCell>
                    <TableCell align="left">{r.phone}</TableCell>
                    <TableCell align="left">{r.createAt}</TableCell>
                    <TableCell align="center">
                      {r.state === 1 ? (
                        <Tooltip title="Marcar como leido">
                          <Button
                            style={{ backgroundColor: genConst.CONST_UPDATE_COLOR }}
                            onClick={() => {
                              handleEdit(r.id);
                            }}
                          >
                            <IconMessage2 color="#FFF" />
                          </Button>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Leida">
                          <Button
                            style={{ backgroundColor: genConst.CONST_VIEW_COLOR }}
                            disabled
                            onClick={() => {
                              handleEdit(r.id);
                            }}
                          >
                            <IconMessage2 color="#FFF" />
                          </Button>
                        </Tooltip>
                      )}
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

export default Mail;

