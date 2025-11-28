import { useNavigate, useParams } from 'react-router';
import { uiStyles } from './Users.styles';
import { AppBar, Box, Grid, IconButton, Toolbar, Typography, Button } from '@mui/material';
import { IconArrowLeft, IconFileCertificate } from '@tabler/icons';
import ItemBingo from 'modules/shared/components/bingo/ItemBingo';
import { useEffect, useState, useRef } from 'react';
import { getUserCardsPaginated, getUserData, getUserName } from 'config/firebaseEvents';
import { useTheme } from '@emotion/react';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { BingoPDFButton } from 'modules/features/admin/bingo-pdf';

const UsersCards = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [user, setUser] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [cardN, setCardN] = useState('');
  const [openCard, setOpenCard] = useState(false);
  const [bingoNumbers, setBingoNumbers] = useState({ bN: [], iN: [], nN: [], gN: [], oN: [] });
  const [loading, setLoading] = useState(true);
  const refreshTableRef = useRef(null);
  const [showPdfGenerator, setShowPdfGenerator] = useState(false);

  const mockEvent = {
    name: 'Nissan 1200 Restaurada',
    startDate: new Date(2025, 7, 16).toLocaleDateString(),
    id: 'test-event-id'
  };

  const handleBack = () => {
    navigate(-1);
  };

  const togglePdfGenerator = () => {
    setShowPdfGenerator(!showPdfGenerator);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Get user name
        const userData = await getUserData(userId);
        setUser(userData?.[0] ?? null);

        // Get user cards
        const { cards } = await getUserCardsPaginated(userId);
        setSelectedItems(cards);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // console.log({ user });

  const refreshTable = () => {
    const fetchUserCards = async () => {
      try {
        setLoading(true);
        const { cards } = await getUserCardsPaginated(userId);
        setSelectedItems(cards);
      } catch (error) {
        console.error('Error refreshing user cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCards();
  };

  // Set refreshTable function to ref for access from child components
  useEffect(() => {
    refreshTableRef.current = refreshTable;
  }, []);

  return (
    <Box sx={uiStyles.box}>
      <AppBar position="static" style={uiStyles.appbar}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => handleBack()}>
            <IconArrowLeft color="#FFF" />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#FFF' }} align="center">
            Cartillas de usuario {user?.fullName || userId}
          </Typography>
          <IconButton color="inherit" onClick={togglePdfGenerator} title="Generar PDF">
            <IconFileCertificate color="#FFF" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* <Box sx={{ textAlign: 'center', my: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}> */}
      {showPdfGenerator && !loading && selectedItems.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-center', gap: 2, mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Generar PDF con las cartillas de {user?.fullName || userId}
          </Typography>
          <BingoPDFButton bingoCards={selectedItems} event={mockEvent} user={user} />
        </Box>
      )}

      {!loading && selectedItems.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 1, mt: 1, px: 1 }}>
          {selectedItems.map((item) => (
            <Grid key={item.id} item lg={0.8} md={1} sm={1.5} xs={2}>
              <ItemBingo
                title={`Cartilla ${item.order}`}
                item={item}
                theme={theme}
                disabled={false}
                setCardN={setCardN}
                setBingoNumbers={setBingoNumbers}
                setOpenCard={setOpenCard}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && selectedItems.length > 0 && !showPdfGenerator && (
        <Box sx={{ textAlign: 'center', my: 2 }}>
          <Button variant="contained" color="primary" startIcon={<PictureAsPdfIcon />} onClick={togglePdfGenerator} sx={{ color: '#FFF' }}>
            Generar PDF de Cartillas
          </Button>
        </Box>
      )}

      {loading && (
        <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
          Cargando cartillas...
        </Typography>
      )}
      {!loading && selectedItems.length === 0 && (
        <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>
          Este usuario no tiene cartillas asignadas.
        </Typography>
      )}
    </Box>
  );
};

export default UsersCards;

