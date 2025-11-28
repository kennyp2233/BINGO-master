import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Avatar } from '@mui/material';

const ItemBingo = ({ title, item, setCardN, setBingoNumbers, setOpenCard, theme }) => {
  return (
    <Tooltip title={title}>
      <Avatar
        variant="rounded"
        color="inherit"
        sx={{
          ...theme.typography.commonAvatar,
          ...theme.typography.mediumAvatar,
          transition: 'all .2s ease-in-out',
          backgroundColor: '#00adef',
          width: 40,
          height: 40,
          color: '#FFF',
          '&[aria-controls="menu-list-grow"],&:hover': {
            background: theme.palette.secondary.light,
            color: '#FFF'
          }
        }}
        onClick={() => {
          setCardN(item.num);
          setBingoNumbers({ bN: item.b, iN: item.i, nN: item.n, gN: item.g, oN: item.o });
          setOpenCard(true);
        }}
      >
        <span style={{ color: '#FFF', fontSize: 15 }}>{item.num}</span>
      </Avatar>
    </Tooltip>
  );
};

ItemBingo.propTypes = {
  title: PropTypes.string.isRequired,
  item: PropTypes.shape({
    num: PropTypes.string.isRequired,
    b: PropTypes.array,
    i: PropTypes.array,
    n: PropTypes.array,
    g: PropTypes.array,
    o: PropTypes.array
  }).isRequired,
  setCardN: PropTypes.func.isRequired,
  setBingoNumbers: PropTypes.func.isRequired,
  setOpenCard: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
};

export default ItemBingo;
