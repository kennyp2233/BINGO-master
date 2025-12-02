import { Grid } from '@mui/material';
import { gameStyles } from '../../styles/gameStyles';
import { gameTexts } from '../../constants/gameTexts';
import { getLetterNumbers, getLetters } from 'modules/shared/utils/bingoConfig';

export const BingoGrid = ({ drawnNumbers }) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        {getLetters().map((letterKey) => {
          const numbers = getLetterNumbers(letterKey);
          const titleKey = letterKey.toLowerCase();
          const gridSize = Math.ceil(Math.sqrt(numbers.length));
          const xsValue = 12 / gridSize;

          return (
            <Grid container sx={{ display: 'flex', alignItems: 'center', mb: 1 }} key={letterKey}>
              <Grid item sx={{ width: 60, textAlign: 'center', backgroundColor: '#179cdc', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1 }}>
                <h3 style={{ ...gameStyles.cellLetter, color: '#FFF' }}>{gameTexts[titleKey]}</h3>
              </Grid>
              <Grid item sx={{ flex: 1, mx: 1 }}>
                <Grid container spacing={0.5} sx={{ height: 180 }}>
                  {numbers.map((item) => {
                    const isDrawn = drawnNumbers.includes(item);
                    return (
                      <Grid
                        id={'btn' + item}
                        key={item}
                        item
                        xs={xsValue}
                        sx={{
                          backgroundColor: isDrawn ? '#26c4fb' : '#FFF',
                          color: isDrawn ? '#FFF' : '#179cdc',
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
                            backgroundColor: isDrawn ? '#26c4fb' : '#F0F0F0'
                          }
                        }}
                      >
                        {item}
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
              <Grid item sx={{ width: 60, textAlign: 'center', backgroundColor: '#179cdc', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1 }}>
                <h3 style={{ ...gameStyles.cellLetter, color: '#FFF' }}>{gameTexts[titleKey]}</h3>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};
