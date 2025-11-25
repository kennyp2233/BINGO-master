import { genConst } from 'store/constant';

export const uiStyles = {
  box: { width: '100%', height: '100%', backgroundColor: '#FFF', borderRadius: 4, padding: 2 },
  paper: { width: '100%', overflow: 'hidden', marginTop: 0 },
  modalStyles: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '@media (min-width: 718px)': {
      width: 800
    },
    '@media (max-width: 718px)': {
      width: 700
    },
    '@media (max-width: 619px)': {
      width: 600
    },
    '@media (max-width: 508px)': {
      width: 500
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
  stepperContainer: {
    width: '100%',
    maxWidth: '100%',
    flexGrow: 1
  },
  stepperPaper: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    pl: 2,
    bgcolor: 'background.default',
    borderRadius: 3
  },
  stepContent: {
    height: '100%',
    maxWidth: '100%',
    width: '100%',
    p: 2
  },
  cardsGrid: {
    width: '100%',
    height: '100%',
    backgroundColor: '#242526',
    borderRadius: 4,
    padding: 2
  },
  summaryBox: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 4,
    padding: 2,
    mt: 1
  },
  selectedCardsContainer: {
    p: 2,
    bgcolor: 'background.default',
    borderRadius: 3
  },
  totalBox: {
    display: 'flex',
    justifyContent: 'space-between',
    mb: 2
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 2
  },
  btnMain: {
    color: '#FFF',
    height: 40,
    width: 160
  },
  btnSecondary: {
    color: '#FFF',
    height: 40,
    width: 140
  },
  cardButton: {
    borderRadius: 8
  },
  cardSelected: {
    background: 'green'
  },
  cardAvailable: {
    background: '#00adef'
  },
  cardUnavailable: {
    background: '#525252'
  },
  userAvatar: {
    width: 32,
    height: 32
  },
  searchInput: {
    flex: 1
  },
  filterSelect: {
    minWidth: 120,
    mr: 2
  },
  paginationContainer: {
    mt: 2,
    display: 'flex',
    justifyContent: 'center'
  }
};