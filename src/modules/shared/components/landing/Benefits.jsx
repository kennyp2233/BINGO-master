import React from 'react';
import useWindowPosition from 'hooks/useWindowPosition';
import { uiStyles } from './styles';
import b1 from 'assets/images/benefits/b1.png';
import b2 from 'assets/images/benefits/b2.png';
import b3 from 'assets/images/benefits/b3.png';
import { Grid, IconButton } from '@mui/material';
import BenefitsCard from './BenefitsCard';
import { Link as Scroll } from 'react-scroll';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Benefits() {
  const checked = useWindowPosition('header');
  return (
    <div style={uiStyles.rootImage} id="benefits">
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={3} md={3} sm={6} xs={6}>
              <BenefitsCard place={places[0]} checked={checked} />
            </Grid>
            <Grid item lg={3} md={3} sm={6} xs={6}>
              <BenefitsCard place={places[1]} checked={checked} />
            </Grid>
            <Grid item lg={3} md={3} sm={6} xs={6}>
              <BenefitsCard place={places[2]} checked={checked} />
            </Grid>
            <Grid item lg={3} md={3} sm={6} xs={6}>
              <BenefitsCard place={places[3]} checked={checked} />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <center>
                <Scroll to="contacts" smooth={true}>
                  <IconButton>
                    <ExpandMoreIcon style={uiStyles.goDown} />
                  </IconButton>
                </Scroll>
              </center>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

const places = [
  {
    title: 'PLAN DE NEGOCIO.',
    description: 'PLAN DE NEGOCIO.',
    imageUrl: b1,
    time: 1500
  },
  {
    title: 'MARKETING DIGITAL',
    description: 'MARKETING DIGITAL',
    imageUrl: b2,
    time: 1500
  },
  {
    title: 'COMERCIO ELECTRÓNICO',
    description: 'COMERCIO ELECTRÓNICO',
    imageUrl: b3,
    time: 1500
  },
  {
    title: 'RED DE MERCADEO',
    description: 'RED DE MERCADEO',
    imageUrl: b2,
    time: 1500
  }
];
