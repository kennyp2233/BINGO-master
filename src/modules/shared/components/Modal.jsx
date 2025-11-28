import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { modalStyle } from 'assets/scss/styles';

const CustomModal = ({ open, handleClose, title, width, children }) => {
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="custom-modal-title" aria-describedby="custom-modal-description">
      <Box sx={{ ...modalStyle, width: width, position: 'relative' }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: '#000'
          }}
        >
          <CloseIcon />
        </IconButton>
        <center>
          <Typography id="custom-modal-title" variant="h4" component="h2">
            {title}
          </Typography>
          <Box sx={{ mt: 2 }}>{children}</Box>
        </center>
      </Box>
    </Modal>
  );
};

CustomModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  children: PropTypes.node
};

export default CustomModal;
