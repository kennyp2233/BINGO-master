import { Grid } from '@mui/material';
import { uiStyles } from '../../board/board.styles';
import { titles } from '../../board/board.texts';
import { getLetterNumbers, getLetters } from 'utils/bingoConfig';

export const BoardGame = ({ number, letter, prevNumber, prevLetter }) => {
  return (
    <>
      <Grid container style={{ marginTop: 10 }}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={uiStyles.bgPanelBallActual}>
              <center>
                <div style={uiStyles.ball}>
                  <h1>{letter}</h1>
                  <h1>{number}</h1>
                </div>
              </center>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={uiStyles.bgPanelBallAnte}>
              <center>
                <div style={uiStyles.ball}>
                  <h1>{prevLetter}</h1>
                  <h1>{prevNumber}</h1>
                </div>
              </center>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={uiStyles.panelBall}>
              <center>
                <span style={uiStyles.panelText}>{titles.actual}</span>
              </center>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6} sx={uiStyles.panelBall}>
              <center>
                <span style={uiStyles.panelText}>{titles.ante}</span>
              </center>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          {/* Renderizar filas dinámicamente basadas en la configuración */}
          {getLetters().map((letterKey) => {
            const numbers = getLetterNumbers(letterKey);
            const titleKey = letterKey.toLowerCase();
            const gridSize = Math.ceil(Math.sqrt(numbers.length));
            const xsValue = 12 / gridSize;

            return (
              <Grid container sx={{ display: 'flex', alignItems: 'center', mb: 1 }} key={letterKey}>
                <Grid item sx={{ width: 60, textAlign: 'center', backgroundColor: '#179cdc', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1 }}>
                  <h3 style={{ ...uiStyles.cellLetter, color: '#FFF' }}>{titles[titleKey]}</h3>
                </Grid>
                <Grid item sx={{ flex: 1, mx: 1 }}>
                  <Grid container spacing={0.5} sx={{ height: 180 }}>
                    {numbers.map((item) => (
                      <Grid
                        id={'btn' + item}
                        key={item}
                        item
                        xs={xsValue}
                        sx={{
                          backgroundColor: '#FFF',
                          color: '#179cdc',
                          fontSize: 14,
                          fontWeight: 'bold',
                          border: '1px solid #EFEFEF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: 35,
                          borderRadius: 1,
                          cursor: 'default',
                          '&:hover': {
                            backgroundColor: '#F0F0F0'
                          }
                        }}
                      >
                        {item}
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item sx={{ width: 60, textAlign: 'center', backgroundColor: '#179cdc', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1 }}>
                  <h3 style={{ ...uiStyles.cellLetter, color: '#FFF' }}>{titles[titleKey]}</h3>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </>
  );
};
