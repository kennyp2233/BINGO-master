import React, { useState } from 'react';
import { uiStyles } from './styles';
import { ButtonGroup, Button, Grid, TextField, Modal } from '@mui/material';
import MainCard from 'modules/shared/components/cards/MainCard';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { IconBrandFacebook, IconBrandInstagram, IconBrandWhatsapp, IconBrandYoutube } from '@tabler/icons';
import * as Msg from 'store/message';
//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generateId } from 'modules/shared/utils/idGenerator';
import { createDocument } from 'config/firebaseEvents';
import { collMail } from 'store/collections';
import { fullDate } from 'modules/shared/utils/validations';

const CardWrapper = styled(MainCard)(() => ({
  backgroundColor: 'rgba(0,0,0,0.6)',
  color: '#fff',
  overflow: 'hidden',
  position: 'relative'
}));

export default function Contacts() {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [subject, setSubject] = useState(null);
  const [message, setMessage] = useState(null);
  const [openLoader, setOpenLoader] = useState(false);

  const handleSendMessage = () => {
    if (!name || !email || !phone || !subject || !message) {
      toast.info(Msg.requiered, { position: toast.POSITION.TOP_RIGHT });
    } else {
      setOpenLoader(true);
      const ide = generateId(10);
      const object = {
        id: ide,
        name: name,
        phone: phone,
        email: email,
        subject: subject,
        message: message,
        createAt: fullDate(),
        updateAt: null,
        deleteAt: null,
        state: 1
      };
      setTimeout(() => {
        createDocument(collMail, ide, object);
        setOpenLoader(false);
        toast.success('Mensaje enviado correctamente!', { position: toast.POSITION.TOP_RIGHT });
        clearData();
      }, 3000);
    }
  };

  const clearData = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div style={uiStyles.rootContact} id="contacts">
      <ToastContainer />
      <Grid container>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item lg={4} md={6} sm={12} xs={12}>
              <CardWrapper border={false} content={false}>
                <Box sx={{ p: 4 }}>
                  <h1 style={{ color: '#53338a', marginBottom: 30 }}>CONTÃCTANOS</h1>
                  <p style={{ textAlign: 'justify', textJustify: 'inter-word' }}>
                    Puedes enviar tus mensajes vía mail, WhatsApp y nuestro equipo te contestará a la brevedad posible, estaremos gustosos
                    de asesorarte para que consigas lo que estás buscando.
                  </p>
                  <h3 style={{ color: '#9f98c2', marginTop: 30 }}>Síguenos en nuestras Redes Sociales:</h3>
                  <center>
                    <ButtonGroup disableElevation variant="contained" aria-label="Disabled elevation buttons">
                      <Button variant="outlined" style={{ width: 60, height: 60 }}>
                        <IconBrandFacebook size={35} />
                      </Button>
                      <Button variant="outlined" style={{ width: 60, height: 60 }}>
                        <IconBrandInstagram size={35} />
                      </Button>
                      <Button variant="outlined" style={{ width: 60, height: 60 }}>
                        <IconBrandYoutube size={35} />
                      </Button>
                      <Button variant="outlined" style={{ width: 60, height: 60 }}>
                        <IconBrandWhatsapp size={35} />
                      </Button>
                    </ButtonGroup>
                  </center>
                </Box>
              </CardWrapper>
            </Grid>
            <Grid item lg={8} md={6} sm={12} xs={12}>
              <CardWrapper border={false} content={false}>
                <Box sx={{ p: 5 }}>
                  <center>
                    <h2>O escríbenos tus dudas en el siguiente formulario:</h2>
                    <Grid container spacing={4}>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextField
                          id="outlined-basic"
                          label="* Nombres Completos"
                          variant="filled"
                          fullWidth
                          color="primary"
                          type="text"
                          value={name || ''}
                          onChange={(ev) => setName(ev.target.value)}
                          inputProps={{ style: { color: '#FFF' } }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextField
                          id="outlined-basic"
                          label="* Correo Electrónico"
                          variant="filled"
                          fullWidth
                          type="email"
                          value={email || ''}
                          onChange={(ev) => setEmail(ev.target.value)}
                          inputProps={{ style: { color: '#FFF' } }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextField
                          id="outlined-basic"
                          label="* Teléfono"
                          variant="filled"
                          fullWidth
                          type="number"
                          value={phone || ''}
                          onChange={(ev) => setPhone(ev.target.value)}
                          inputProps={{ style: { color: '#FFF' } }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextField
                          id="outlined-basic"
                          label="* Asunto"
                          variant="filled"
                          fullWidth
                          type="text"
                          value={subject || ''}
                          onChange={(ev) => setSubject(ev.target.value)}
                          inputProps={{ style: { color: '#FFF' } }}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          id="outlined-basic"
                          label="* Mensaje"
                          variant="filled"
                          fullWidth
                          multiline
                          rows={4}
                          type="text"
                          value={message || ''}
                          onChange={(ev) => setMessage(ev.target.value)}
                          inputProps={{ style: { color: '#FFF' } }}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Button disableElevation fullWidth size="large" variant="contained" color="secondary" onClick={handleSendMessage}>
                          Enviar
                        </Button>
                      </Grid>
                    </Grid>
                  </center>
                </Box>
              </CardWrapper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Modal open={openLoader} aria-labelledby="modal-loader" aria-describedby="modal-loader">
        <center>
          <Box sx={uiStyles.styleLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </div>
  );
}

