import { genConst } from 'store/constant';

export const uiStyles = {
  box: { width: '100%', height: '100%', backgroundColor: '#FFF', borderRadius: 4, padding: 2 },
  appbar: { borderRadius: 15, height: 60, backgroundColor: genConst.CONST_APPBAR },
  box2: { flexGrow: 1, display: { xs: 'none', md: 'flex' } },
  boxCard: { width: '44%', height: '60%', backgroundColor: '#F4F4F4', borderRadius: 4, padding: 2 },
  paper: { width: '100%', overflow: 'hidden', marginTop: 0 },
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
  dateInput: {
    height: 50,
    padding: 10,
    fontSize: 16,
    border: '0.4px solid #c2c2c2',
    borderRadius: 10,
    fontFamily: 'Montserrat'
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
  modalCardStyles: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '@media (min-width: 718px)': {
      width: 500
    },
    '@media (max-width: 718px)': {
      width: 400
    },
    '@media (max-width: 619px)': {
      width: 400
    },
    '@media (max-width: 508px)': {
      width: 350
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
  btnMain: {
    color: '#FFF',
    height: 40,
    width: 160
  },
  btnCount: {
    color: '#179cdc',
    height: 40,
    width: 100
  },
  ball: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    color: '#179cdc',
    width: 120,
    height: 120,
    borderRadius: 70,
    padding: 10,
    margin: 10
  },
  panelBall: {
    backgroundColor: '#696969',
    height: 40
  },
  panelBallEndLeft: {
    backgroundColor: '#696969',
    height: 40,
    borderBottomLeftRadius: 20
  },
  panelBallEndRight: {
    backgroundColor: '#696969',
    height: 40,
    borderBottomRightRadius: 20
  },
  bgPanelBallActual: {
    backgroundColor: '#179cdc',
    borderTopLeftRadius: 20
  },
  bgPanelBallAnte: {
    backgroundColor: '#04acec',
    borderTopRightRadius: 20
  },
  panelText: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  leftCell: {
    background: '#179cdc',
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '0.2px solid #EFEFEF'
  },
  midCol: {
    background: '#FFF',
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  midCell: {
    background: '#FFF',
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '0.2px solid #EFEFEF'
  },
  cellLetter: {
    fontSize: 20,
    color: '#FFF'
  },
  cellItem: { color: '#179cdc', fontSize: 18 },
  endBtn: { width: 200, height: 60, backgroundColor: '#FFF', color: '#00adef' }
};