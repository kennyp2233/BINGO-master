/* eslint-disable react/prop-types */
import React from 'react';
import { Card, CardContent, Collapse } from '@mui/material';
import { uiStyles } from './styles';

export default function ImageServiceCard({ place, checked }) {
  return (
    <Collapse in={checked} {...(checked ? { timeout: 1000 } : {})}>
      <Card style={uiStyles.rootPlace}>
        <CardContent style={uiStyles.contentService}>
          <h1 style={uiStyles.titleService}>{place.title}</h1>
          <p style={uiStyles.descPlace}>{place.description}</p>
        </CardContent>
      </Card>
    </Collapse>
  );
}
