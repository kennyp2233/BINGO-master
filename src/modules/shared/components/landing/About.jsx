import React from 'react';
import ImageCard from './ImageCard';
import useWindowPosition from 'hooks/useWindowPosition';
import { uiStyles } from './styles';
import { Grid, IconButton } from '@mui/material';
import a1 from 'assets/images/benefits/1.jpg';
import a2 from 'assets/images/benefits/2.jpg';
import { Link as Scroll } from 'react-scroll';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function About() {
  const checked = useWindowPosition('header');
  return (
    <div style={uiStyles.rootImage} id="about">
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={4} md={4} sm={4} xs={12}>
              <ImageCard place={places[0]} checked={checked} />
            </Grid>
            <Grid item lg={4} md={4} sm={4} xs={12}>
              <ImageCard place={places[1]} checked={checked} />
            </Grid>
            <Grid item lg={4} md={4} sm={4} xs={12}>
              <ImageCard place={places[2]} checked={checked} />
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
    title: 'Somos KHUSKA',
    description: 'Emprendedores apoyándote a crear, innovar, brindar crecimiento y sostenibilidad en el tiempo para tu negocio y empresa.',
    imageUrl: a1,
    time: 1500
  },
  {
    title: '',
    description:
      'Institución dedicada a brindar productos y servicios únicos, oportunos y excepcionales que apoyan a emprendedores en la consecución de sus metas.',
    imageUrl: a2,
    time: 1500
  },
  {
    title: '',
    description:
      'Siendo el conocimiento, la calidad de vida y los valores compartidos; el eje principal para el desarrollo de nuestros colaboradores y de la sociedad en general.',
    imageUrl: a1,
    time: 1500
  }
];
