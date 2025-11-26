// assets
import { IconDashboard, IconNotebook } from '@tabler/icons';
// constant
const icons = { IconDashboard, IconNotebook };

const dashboard = {
  id: 'dashboard',
  title: 'Panel Principal',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Panel Principal',
      type: 'item',
      url: '/main/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'cards-user',
      title: 'Asignar Cartillas',
      type: 'item',
      url: '/main/cards-user',
      icon: icons.IconNotebook,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
