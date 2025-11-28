import { genConst } from 'store/constant';

export const uiStyles = {
  appbar: { borderRadius: 15, height: 60, backgroundColor: genConst.CONST_APPBAR },
  container: { marginTop: 0 },
  box: { width: '100%', height: '100%', backgroundColor: '#FFF', borderRadius: 4, padding: 2 },
  boxMenuActions: { flexGrow: 1, display: { xs: 'none', md: 'flex' } },
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
  modalStylesDelete: {
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
  },
  modalStylesLoader: {
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
  modalLoader: {
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
  imagePic: { width: 50, height: 50, borderRadius: '50%' },
  stateActive: { marginTop: -10, color: '#5ABD7C', fontSize: 12 },
  stateNoActive: { marginTop: -10, color: '#EB635D', fontSize: 12 },
  name: { marginTop: 2, fontSize: 11 },
  email: { marginTop: -10, fontSize: 9 },
  btn: { width: 140 }
};
