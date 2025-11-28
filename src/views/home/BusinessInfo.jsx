/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Grid, Button, FormControl } from '@mui/material';
import MainCard from 'modules/shared/components/cards/MainCard';
import { uiStyles } from 'components/search/styles';
import { styled } from '@mui/material/styles';
import { IconArrowLeft, IconBrandFacebook, IconBrandInstagram, IconBrandYoutube } from '@tabler/icons';
import { getBusinessById } from 'config/firebaseEvents';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const CardWrapper = styled(MainCard)(() => ({
  backgroundColor: 'rgba(255,255,255,0.4)',
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  padding: 15,
  marginLeft: 30,
  marginRight: 30
}));
const CardWrapperInfo = styled(MainCard)(() => ({
  backgroundColor: 'rgba(255,255,255,0.3)',
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  padding: 15,
  marginTop: 10,
  marginLeft: 30,
  marginRight: 30
}));

const BusinessInfo = () => {
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [dataInfo, setDataInfo] = useState([]);
  const [images, setImages] = useState([]);
  useEffect(() => {
    getBusinessById(id).then((data) => {
      setDataInfo(data);
      setImages([
        {
          original: data[0].logo,
          thumbnail: data[0].logo,
          originalHeight: 400,
          thumbnailWidth: 50,
          thumbnailHeight: 50
        },
        {
          original: data[0].picture1,
          thumbnail: data[0].picture1,
          originalHeight: 400,
          thumbnailWidth: 50,
          thumbnailHeight: 50
        },
        {
          original: data[0].picture2,
          thumbnail: data[0].picture2,
          originalHeight: 400,
          thumbnailWidth: 50,
          thumbnailHeight: 50
        },
        {
          original: data[0].picture3,
          thumbnail: data[0].picture3,
          originalHeight: 400,
          thumbnailWidth: 50,
          thumbnailHeight: 50
        },
        {
          original: data[0].picture4,
          thumbnail: data[0].picture4,
          originalHeight: 400,
          thumbnailWidth: 50,
          thumbnailHeight: 50
        }
      ]);
    });
  }, []);

  const handleBack = () => {
    navigate('/net/search');
  };

  return (
    <div style={uiStyles.container}>
      <CardWrapper border={false} content={false}>
        <Box sx={{ p: 0 }}>
          <Grid container>
            <Grid item xs={12}>
              <Grid container spacing={6}>
                <Grid item lg={2} md={2} sm={2} xs={2}>
                  <Button startIcon={<IconArrowLeft />} variant="outlined" onClick={handleBack}>
                    {' '}
                    Regresar
                  </Button>
                </Grid>
                <Grid item lg={10} md={10} sm={10} xs={10}>
                  <Box sx={{ p: 0 }}></Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </CardWrapper>
      <CardWrapperInfo border={false} content={false}>
        <Grid container>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                {dataInfo.map((info, key) => (
                  <Grid key={key} container spacing={1}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <h1 style={{ marginTop: 10, color: '#53338a' }}>{info.name}</h1>
                      <h3 style={{ color: '#53338a' }}>{info.description}</h3>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <Grid key={key} container spacing={1}>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <Grid key={key} container spacing={1}>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                              <FormControl fullWidth style={{ marginBottom: 10 }}>
                                <strong style={{ color: '#53338a', fontSize: 18, marginButtom: 10, textAlign: 'right' }}>
                                  Responsable:
                                </strong>
                              </FormControl>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                              <FormControl fullWidth style={{ marginBottom: 10 }}>
                                <span style={{ fontSize: 16, color: '#53338a', textAlign: 'left' }}>{info.owner}</span>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid key={key} container spacing={1}>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                              <FormControl fullWidth style={{ marginBottom: 10 }}>
                                <strong style={{ color: '#53338a', fontSize: 18, marginButtom: 10, textAlign: 'right' }}>
                                  Provincia / Ciudad:
                                </strong>
                              </FormControl>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                              <FormControl fullWidth style={{ marginBottom: 10 }}>
                                <span style={{ fontSize: 16, color: '#53338a', textAlign: 'left' }}>
                                  {info.province + ' / ' + info.city}
                                </span>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid key={key} container spacing={1}>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                              <FormControl fullWidth style={{ marginBottom: 10 }}>
                                <strong style={{ color: '#53338a', fontSize: 18, marginButtom: 10, textAlign: 'right' }}>Dirección:</strong>
                              </FormControl>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                              <FormControl fullWidth style={{ marginBottom: 10 }}>
                                <span style={{ fontSize: 16, color: '#53338a', textAlign: 'left' }}>{info.address}</span>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid key={key} container spacing={1}>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                              <FormControl fullWidth style={{ marginBottom: 10 }}>
                                <strong style={{ color: '#53338a', fontSize: 18, marginButtom: 10, textAlign: 'right' }}>Teléfono:</strong>
                              </FormControl>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                              <FormControl fullWidth style={{ marginBottom: 10 }}>
                                <span style={{ fontSize: 16, color: '#53338a', textAlign: 'left' }}>{info.phone}</span>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid key={key} container spacing={1}>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                              <FormControl fullWidth style={{ marginBottom: 10 }}>
                                <strong style={{ color: '#53338a', fontSize: 18, marginButtom: 10, textAlign: 'right' }}>Email:</strong>
                              </FormControl>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                              <FormControl fullWidth style={{ marginBottom: 10 }}>
                                <span style={{ fontSize: 16, color: '#53338a', textAlign: 'left' }}>{info.email}</span>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid key={key} container spacing={1}>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                              <FormControl fullWidth style={{ marginBottom: 10 }}>
                                <strong style={{ color: '#53338a', fontSize: 18, marginButtom: 10, textAlign: 'right' }}>Sitio Web:</strong>
                              </FormControl>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                              <FormControl fullWidth style={{ marginBottom: 10 }}>
                                <span style={{ fontSize: 16, color: '#53338a', textAlign: 'left' }}>{info.webPage}</span>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid key={key} container spacing={1}>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                              <FormControl fullWidth style={{ marginBottom: 10 }}>
                                <strong style={{ color: '#53338a', fontSize: 18, marginButtom: 10, textAlign: 'right' }}>
                                  Redes Sociales:
                                </strong>
                              </FormControl>
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                              <center>
                                <a href={info.facebook} target="blank" style={{ padding: 10 }}>
                                  <IconBrandFacebook size={40} color="#53338a" />
                                </a>
                                <a href={info.instagram} target="blank" style={{ padding: 10 }}>
                                  <IconBrandInstagram size={40} color="#53338a" />
                                </a>
                                <a href={info.youtube} target="blank" style={{ padding: 10 }}>
                                  <IconBrandYoutube size={40} color="#53338a" />
                                </a>
                              </center>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <center>
                            <ImageGallery
                              items={images}
                              autoPlay
                              showPlayButton={false}
                              showNav={false}
                              showFullscreenButton={false}
                              slideInterval={5000}
                            />
                          </center>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardWrapperInfo>
    </div>
  );
};

export default BusinessInfo;

