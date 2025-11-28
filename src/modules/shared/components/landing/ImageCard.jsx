/* eslint-disable react/prop-types */
import React from 'react';
import { Card, CardContent, CardMedia, Collapse } from '@mui/material';
import { uiStyles } from './styles';

export default function ImageCard({ place, checked }) {
  return (
    <Collapse in={checked} {...(checked ? { timeout: 1000 } : {})}>
      <Card style={uiStyles.rootPlace}>
        <CardMedia style={uiStyles.media} image={place.imageUrl} title="Contemplative Reptile" />
        <CardContent style={uiStyles.contentAbout}>
          <h1 style={uiStyles.titlePlace}>{place.title}</h1>
          <p style={uiStyles.descPlace}>{place.description}</p>
        </CardContent>
      </Card>
    </Collapse>
  );
}
