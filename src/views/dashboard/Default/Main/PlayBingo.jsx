import { useSearchParams } from 'react-router-dom';
// material-ui
import { Box, Grid, ButtonGroup, Button } from '@mui/material';
import MessageDark from 'components/message/MessageDark';
import { useEffect, useState } from 'react';
import { getGameCardsByUserEvent } from 'config/firebaseEvents';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';
import ReactPlayer from 'react-player';
import { getLetters } from 'utils/bingoConfig';
//Notifications
//import { ToastContainer, toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';

const PlayBingo = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const date = searchParams.get('date');
  const transmition = searchParams.get('transmition');
  const [cards, setCards] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    onAuthStateChanged(authentication, async (user) => {
      if (user) {
        setUserId(user.uid);
        getGameCardsByUserEvent(user.uid, id).then((data) => {
          setCards(data);
        });
      }
    });
  }, [id]);

  const handleMark = (letter, id, val) => {
    document.getElementById(letter.toLowerCase() + id + val).style.background = '#737373';
    document.getElementById(letter.toLowerCase() + id + val).style.color = '#FFF';
    document.getElementById(letter.toLowerCase() + id + val).disabled = true;
  };

  return (
    <Box sx={{ width: '100%', height: '100%', backgroundColor: '#FFF', borderRadius: 4, padding: 2 }}>
      <h3 hidden>{id}</h3>
      <h3 hidden>{userId}</h3>
      <Grid container direction="column" sx={{ mt: 1 }}>
        <Grid item>
          <Grid container spacing={0.3}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <MessageDark message={name + ' / ' + date} submessage={'Espera que el evento inicie!'} />
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <div style={{ marginTop: 10, padding: 5, height: 400, backgroundColor: '#000', borderRadius: 10 }}>
                <ReactPlayer className="react-player" url={transmition || null} width="100%" height="100%" loop volume={0.1} playing />
              </div>
            </Grid>
            <Grid item lg={6} md={12} sm={12} xs={12} style={{ marginTop: 0 }}>
              <Grid container direction="column">
                <Grid item>
                  <Grid container>
                    {cards.map((item) => (
                      <Grid key={item.id} item lg={6} md={6} sm={6} xs={12}>
                        <center>
                          <h3 style={{ color: '#00adef' }}>00000{item.num}</h3>
                          {getLetters().map((letter) => (
                            <ButtonGroup key={letter} aria-label="Basic button group" orientation="vertical">
                              <Button
                                variant="contained"
                                style={{ color: '#FFF', fontWeight: 'bold', height: 50, width: 50, borderRadius: 0 }}
                              >
                                {letter}
                              </Button>
                              {item[letter.toLowerCase()].map((i, key) =>
                                i === 'FREE' || i == 0 ? (
                                  <Button key={letter + key} variant="contained" style={{ height: 50, width: 50, color: '#FFF' }}>
                                    FREE
                                  </Button>
                                ) : (
                                  <Button
                                    key={letter + key}
                                    id={letter.toLowerCase() + item.id + i}
                                    variant="outlined"
                                    style={{ height: 50, width: 50, borderRadius: 0 }}
                                    onClick={() => {
                                      handleMark(letter, item.id, i);
                                    }}
                                  >
                                    {i}
                                  </Button>
                                )
                              )}
                            </ButtonGroup>
                          ))}
                        </center>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlayBingo;
