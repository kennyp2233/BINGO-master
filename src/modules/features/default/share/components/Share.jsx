import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, FormControl, Grid, InputLabel, OutlinedInput } from '@mui/material';
import MessageDark from 'components/message/MessageDark';
import { authentication } from 'config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AnimateButton from 'components/extended/AnimateButton';
import { EmailShareButton, FacebookShareButton, WhatsappShareButton } from 'react-share';
import { EmailIcon, FacebookIcon, WhatsappIcon } from 'react-share';
import { IconCopy } from '@tabler/icons';
import { getShareInfo, copyToClipboard } from '../services/shareService';

const Share = () => {
  const [path, setPath] = useState(null);
  const [copied, setCopied] = React.useState(false);
  const [shareInfo, setShareInfo] = useState(null);
  const inputId = 'link-input';
  const buttonId = 'copy-button';

  useEffect(() => {
    onAuthStateChanged(authentication, async (user) => {
      if (user) {
        const info = await getShareInfo(user.uid);
        setPath(info.invitationLink);
        setShareInfo(info);
      }
    });
  }, []);

  const handleCopy = async () => {
    if (path) {
      const success = await copyToClipboard(path);
      if (success) {
        setCopied(true);
      }
    }
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
                  body={shareInfo?.shareMessage}
                  hashtag={shareInfo?.hashtags}
                  style={{ marginLeft: 10 }}
                >
                  <EmailIcon logofillcolor="white" round={true} size={40}></EmailIcon>
                </EmailShareButton>
                <FacebookShareButton
                  url={path}
                  quote={shareInfo?.shareMessage}
                  hashtag={shareInfo?.hashtags}
                  style={{ marginLeft: 10 }}
                >
                  <FacebookIcon logofillcolor="white" round={true} size={40}></FacebookIcon>
                </FacebookShareButton>
                <WhatsappShareButton
                  url={path}
                  title={shareInfo?.shareMessage}
                  hashtag={shareInfo?.hashtags}
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