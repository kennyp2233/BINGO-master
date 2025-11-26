import PropTypes from 'prop-types';
// material-ui
import { Typography } from '@mui/material';
// project imports
import NavGroup from './NavGroup';
import adminItems from 'modules/features/admin/constants/menu/admin-items';
import bingoItems from 'modules/features/admin/constants/menu/bingo-items';

const MenuList = ({ menuType }) => {
  const menuItem = menuType === 'bingo' ? bingoItems : adminItems;

  const navItems = menuItem.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

MenuList.propTypes = {
  menuType: PropTypes.string
};

export default MenuList;
