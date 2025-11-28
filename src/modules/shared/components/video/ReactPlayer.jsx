import React from 'react';
import { Button, Grid, ButtonGroup } from '@mui/material';
import { IconPlayerPlay, IconPlayerPause, IconVolume2, IconVolume3 } from '@tabler/icons';
import ReactPlayer from 'react-player/lazy';

const VideoPlayer = () => {
  return (
    <div>
      <ReactPlayer
        className="react-player"
        //url={fileVideo}
        width="100%"
        height="90%"
        loop
        volume={0.1}
      />
      {isControls ? (
        <></>
      ) : (
        <>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <center>
                <ButtonGroup>
                  <Button variant="contained" color="error" style={uiStyles.cancelButton} onClick={handlePlaying}>
                    {!isPlaying ? <IconPlayerPlay /> : <IconPlayerPause />}
                  </Button>
                  <Button variant="contained" color="error" style={uiStyles.cancelButton} onClick={handleMute}>
                    {!isMute ? <IconVolume2 /> : <IconVolume3 />}
                  </Button>
                </ButtonGroup>
              </center>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
