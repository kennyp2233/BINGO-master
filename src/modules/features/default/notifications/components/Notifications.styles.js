import { genConst } from 'store/constant';

export const uiStyles = {
  appbar: { borderRadius: 10, height: 50, backgroundColor: genConst.CONST_APPBAR },
  box: { width: '100%', height: '100%', backgroundColor: '#FFF', borderRadius: 4, padding: 2 },
  paper: { width: '100%', overflow: 'hidden', marginTop: 2 },
  modalStyles: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '@media (min-width: 718px)': {
      width: 700
    },
    '@media (max-width: 718px)': {
      width: 600
    },
    '@media (max-width: 619px)': {
      width: 500
    },
    '@media (max-width: 508px)': {
      width: 450
    },
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: 6,
    boxShadow: 24,
    p: 4
  },
  styleLoader: {
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
  styleDelete: {
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