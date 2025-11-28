/* eslint-disable react/prop-types */
import React from 'react';
import { Card, CardContent, CardMedia, Collapse } from '@mui/material';
import { uiStyles } from './styles';

export default function BenefitsCard({ place, checked }) {
  return (
    <Collapse in={checked} {...(checked ? { timeout: 1000 } : {})}>
      <Card style={uiStyles.rootPlace}>
        <CardMedia style={uiStyles.mediaBenefit} image={place.imageUrl} title="Contemplative Reptile" />
        <CardContent style={uiStyles.content}>
          <h1 style={uiStyles.titlePlaceBenefit}>{place.title}</h1>
          <p style={uiStyles.descPlaceBenefit}>{place.description}</p>
        </CardContent>
      </Card>
    </Collapse>
  );
}
