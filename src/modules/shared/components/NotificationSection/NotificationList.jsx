/* eslint-disable react/prop-types */
import React from 'react';
// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Divider, Grid, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography } from '@mui/material';

// assets
import User1 from 'assets/images/profile/profile-picture-6.jpg';

// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  padding: 16,
  '&:hover': {
    background: theme.palette.primary.light
  },
  '& .MuiListItem-root': {
    padding: 0
  }
}));

const NotificationList = ({ id, avatar, createAt, message, name }) => {
  const theme = useTheme();

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 330,
        py: 0,
        borderRadius: '10px',
        [theme.breakpoints.down('md')]: {
          maxWidth: 300
        },
        '& .MuiListItemSecondaryAction-root': {
          top: 22
        },
        '& .MuiDivider-root': {
          my: 0
        },
        '& .list-container': {
          pl: 7
        }
      }}
    >
      <ListItemWrapper key={id}>
        <ListItem alignItems="center">
          <ListItemAvatar>
            <Avatar alt={id} src={avatar || User1} />
          </ListItemAvatar>
          <ListItemText primary={name} />
          <ListItemSecondaryAction>
            <Grid container justifyContent="flex-end">
              <Grid item xs={12}>
                <Typography variant="caption" display="block" gutterBottom>
                  {createAt}
                </Typography>
              </Grid>
            </Grid>
          </ListItemSecondaryAction>
        </ListItem>
        <Grid container direction="column" className="list-container">
          <Grid item xs={12} sx={{ pb: 2 }}>
            <Typography variant="subtitle2">{message}</Typography>
          </Grid>
        </Grid>
      </ListItemWrapper>
      <Divider />
    </List>
  );
};

export default NotificationList;
