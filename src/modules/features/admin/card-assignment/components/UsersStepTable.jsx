import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import { uiStyles } from '../card-assignment.styles';
import { titles } from '../card-assignment.texts';
import { IconCheck } from '@tabler/icons';
import { getUsersListPaginated } from 'modules/features/admin/users';
import { genConst } from 'store/constant';
import PropTypes from 'prop-types';
import { AddUserModal } from 'views/dashboard/Admin/Users/AddUserModal';
import MessageDark from 'modules/shared/components/message/MessageDark';
import User1 from 'assets/images/profile/profile-picture-6.jpg';

export const UsersStepTable = ({ user, setUser }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { users: fetchedUsers, totalCount } = await getUsersListPaginated(page, rowsPerPage, search);
      console.log('fetchedUsers', { fetchedUsers, totalCount });

      setUsers(fetchedUsers);
      setTotalUsers(totalCount);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = async () => {
    // Reiniciamos la paginación cuando añadimos un usuario nuevo
    setPage(0);
    await fetchUsers();
  };

  // Usar useEffect para manejar cambios en la paginación
  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  // Usar useEffect separado para manejar la búsqueda con debounce
  useEffect(() => {
    // Limpiar timeout anterior si existe
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Establecer nuevo timeout para la búsqueda
    const timeoutId = setTimeout(() => {
      // Resetear a la primera página cuando cambia la búsqueda
      setPage(0);
      fetchUsers();
    }, 500);

    setSearchTimeout(timeoutId);

    // Cleanup al desmontar el componente
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchChange = (ev) => {
    setSearch(ev.target.value);
  };

  return (
    <Box>
      <Box sx={{ mt: -3, mb: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
        <AddUserModal onSuccess={refreshUsers} />
        <OutlinedInput
          id={'search'}
          type="text"
          name={'search'}
          onChange={handleSearchChange}
          placeholder={titles.searchUsers}
          sx={{ flex: 1 }}
          value={search}
        />
      </Box>
      <Paper sx={uiStyles.paper}>
        <TableContainer sx={{ maxHeight: '100%' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell key="id-name" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                  {'Nombre'}
                </TableCell>
                <TableCell key="id-email" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                  {'Email'}
                </TableCell>
                <TableCell key="id-actions" align="center" style={{ minWidth: 75, fontWeight: 'bold' }}>
                  {'Acciones'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((userRecord) => (
                  <TableRow hover key={userRecord.id}>
                    <TableCell align="left">
                      <ButtonGroup>
                        <Avatar src={userRecord.avatar || User1} color="inherit" style={{ width: 32, height: 32 }} />
                        <span style={{ margin: 6 }}>
                          {userRecord.fullName ||
                            `${userRecord.name || ''} ${userRecord.lastName || ''}`.trim() ||
                            userRecord.email ||
                            'Usuario sin nombre'}
                        </span>
                      </ButtonGroup>
                    </TableCell>
                    <TableCell align="left">{userRecord.email}</TableCell>
                    <TableCell align="center">
                      <ButtonGroup variant="contained">
                        <Button
                          style={{
                            backgroundColor: userRecord.id === user?.id ? genConst.CONST_SUCCESS_COLOR : genConst.CONST_PRIMARY_COLOR
                          }}
                          onClick={() => {
                            setUser(userRecord);
                          }}
                        >
                          <IconCheck color="#FFF" />
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <MessageDark message="No se encontraron usuarios" submessage="" />
                  </TableCell>
                </TableRow>
              )}
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
    </Box>
  );
};

UsersStepTable.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func
};
