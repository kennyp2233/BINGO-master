import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, FormControl, Grid, InputLabel, OutlinedInput } from '@mui/material';
import MessageDark from 'modules/shared/components/message/MessageDark';
import { authentication } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AnimateButton from 'modules/shared/components/extended/AnimateButton';
import Clipboard from 'clipboard';
import { EmailShareButton, FacebookShareButton, WhatsappShareButton } from 'react-share';
import { EmailIcon, FacebookIcon, WhatsappIcon } from 'react-share';
import { IconCopy } from '@tabler/icons';

const Share = () => {
  const [path, setPath] = useState(null);
  const [copied, setCopied] = React.useState(false);
  const inputId = 'link-input';
  const buttonId = 'copy-button';

  useEffect(() => {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        setPath(`${window.location.origin}/auth/join/${user.uid}`);
        //TO DO State client
      }
    });
  }, []);

  const handleCopy = () => {
    var clipboard = new Clipboard(`#${buttonId}`);
    clipboard.on('success', () => {
      setCopied(true);
    });
  };

  return (
    <Grid container style={{ marginTop: 20 }}>
      <Grid item xs={12}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <MessageDark
            message={'Invita a tus amigos por correo electrónico o por redes sociales'}
            submessage="Puedes invitar a tus amigos a través del siguiente link:"
          />
          <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={10}>
              <FormControl fullWidth>
                <OutlinedInput id={inputId} type="text" value={path || ''} required />
              </FormControl>
            </Grid>
            <Grid item xs={2} style={{ paddingLeft: 5 }}>
              <Box sx={{ mt: 0.7 }}>
                <AnimateButton>
                  <Button
                    size="large"
                    variant="contained"
                    id={buttonId}
                    data-clipboard-target={`#${inputId}`}
                    color="secondary"
                    onClick={handleCopy}
                    style={{ width: '100%' }}
                  >
                    <IconCopy />
                  </Button>
                </AnimateButton>
              </Box>
            </Grid>
          </Grid>
          {copied && (
            <InputLabel
              htmlFor="outlined-copied"
              style={{ textAlign: 'center', marginTop: 10, color: '#2576F2', fontWeight: 'bold', fontSize: 14 }}
            >
              Link copiado a tu portapapeles
            </InputLabel>
          )}
          <Card style={{ marginTop: 10 }}>
            <CardActions>
              <h4>Compartir a: </h4>
              <center>
                <EmailShareButton
                  url={path}
                  body="Hola : ), juntos hacia la construcción de un mejor futuro. Ãšnete a ðŸ‘‰KHUSKAðŸ‘ˆ"
                  hashtag="#KHUSKA"
                  style={{ marginLeft: 10 }}
                >
                  <EmailIcon logofillcolor="white" round={true} size={40}></EmailIcon>
                </EmailShareButton>
                <FacebookShareButton
                  url={path}
                  quote={'Hola : ), juntos hacia la construcción de un mejor futuro. Ãšnete a ðŸ‘‰KHUSKAðŸ‘ˆ'}
                  hashtag="#KHUSKA"
                  style={{ marginLeft: 10 }}
                >
                  <FacebookIcon logofillcolor="white" round={true} size={40}></FacebookIcon>
                </FacebookShareButton>
                <WhatsappShareButton
                  url={path}
                  title={'Hola : ), juntos hacia la construcción de un mejor futuro. Ãšnete a ðŸ‘‰KHUSKAðŸ‘ˆ'}
                  hashtag="#KHUSKA"
                  style={{ marginLeft: 10 }}
                >
                  <WhatsappIcon logofillcolor="white" round={true} size={40}></WhatsappIcon>
                </WhatsappShareButton>
              </center>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Share;

