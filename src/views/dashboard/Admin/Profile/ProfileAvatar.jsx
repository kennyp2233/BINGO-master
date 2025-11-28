import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// material-ui
import { styled } from '@mui/material/styles';
import { Box, Grid, Typography, Modal } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
// project imports
import MainCard from 'modules/shared/components/cards/MainCard';
import defaultUser from 'assets/images/profile/profile-picture-6.jpg';
//Notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Firebase
import { db, storage, authentication } from 'config/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { collUsers } from 'store/collections';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative'
}));

const ProfileAvatar = ({ id, name, email }) => {
  const [userList, setUserList] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const list = [];
      const querySnapshot = await getDocs(collection(db, collUsers));
      querySnapshot.forEach((doc) => {
        if (id === doc.data().id) {
          list.push(doc.data());
          setUserList(list);
        }
      });
    }
    fetchData();
  }, [id]);

  const imageChange0 = (e) => {
    if (e.target.files.length) {
      let img = new Image();
      img.src = window.URL.createObjectURL(e.target.files[0]);
      let raw = e.target.files[0];
      const imageName = id + '.jpg';
      const imageRef = ref(storage, `avatar/${imageName}`);
      setOpen(true);
      uploadBytes(imageRef, raw).then((snap) => {
        getDownloadURL(snap.ref).then((avatar) => {
          const obj = {
            avatar: avatar
          };
          const docRef = updateDoc(doc(db, collUsers, id), obj)
            .then(() => {
              updateProfile(authentication.currentUser, {
                photoURL: avatar
              });
              toast.success('Avatar actualizado correctamente!', {
                autoClose: 2000,
                position: toast.POSITION.TOP_RIGHT
              });
              setTimeout(() => {
                window.location.reload();
                setOpen(false);
              }, 2000);
            })
            .catch((error) => {
              console.log(error);
            });
          console.log(docRef.id);
        });
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <CardWrapper border={false} content={false}>
        <Box sx={{ p: 5 }}>
          <Grid container direction="column">
            <Grid item>
              <Grid container justifyContent="center">
                <input type="file" id="upload-avatar" style={{ display: 'none' }} onChange={imageChange0} />
                <label htmlFor="upload-avatar" style={{ marginRight: 10 }}>
                  {userList.map((user, key) => (
                    <div key={key}>
                      <center>
                        <img
                          src={user.avatar || defaultUser}
                          alt="profile-avatar"
                          style={{
                            width: 180,
                            height: 180,
                            cursor: 'pointer',
                            borderRadius: '50%'
                          }}
                        />
                      </center>
                    </div>
                  ))}
                </label>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container justifyContent="center">
                <Typography component="span" variant="h5" sx={{ fontWeight: 500, color: '#FFF', marginTop: 1 }}>
                  {name}
                </Typography>
              </Grid>
              <Grid container justifyContent="center">
                <Typography component="span" variant="h5" sx={{ fontWeight: 400, color: '#FFF', marginTop: 1 }}>
                  {email}
                </Typography>
              </Grid>
              <Grid container justifyContent="center">
                <Typography component="span" variant="h5" sx={{ fontWeight: 'bold', color: '#FFF', marginTop: 1 }}>
                  Usuario desde:
                </Typography>
              </Grid>
              <Grid container justifyContent="center">
                {userList.map((user, key) => (
                  <Typography key={key} component="span" variant="h5" sx={{ fontWeight: 400, color: '#FFF', marginTop: 1 }}>
                    {user.createAt}
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </CardWrapper>
      <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <center>
          <Box sx={style}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 80,
  height: 80,
  bgcolor: 'transparent',
  border: 'none',
  borderRadius: 6,
  boxShadow: 0,
  p: 4
};

ProfileAvatar.propTypes = {
  id: PropTypes.string,
  email: PropTypes.string,
  name: PropTypes.string
};

export default ProfileAvatar;

