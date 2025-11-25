export const uiStyles = {
  modalStyles: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '@media (min-width: 718px)': {
      width: 500
    },
    '@media (max-width: 718px)': {
      width: 500
    },
    '@media (max-width: 619px)': {
      width: 400
    },
    '@media (max-width: 508px)': {
      width: 400
    },
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: 6,
    boxShadow: 24,
    p: 4
  },
  loader: {
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
  },
  modalPayment: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '@media (min-width: 718px)': {
      width: 400
    },
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: 6,
    boxShadow: 24,
    p: 4
  }
};