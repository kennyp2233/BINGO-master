// assets
import {
  IconDashboard,
  IconUsers,
  IconFriends,
  IconBell,
  IconShare,
  IconBuilding,
  IconNetwork,
  IconMoneybag,
  IconGoGame,
  IconCardboards,
  IconNotebook,
  IconDeviceGamepad,
  IconCash,
  IconCalendar
} from '@tabler/icons';

// constant
const icons = {
  IconCardboards,
  IconDashboard,
  IconUsers,
  IconFriends,
  IconBell,
  IconShare,
  IconBuilding,
  IconNetwork,
  IconMoneybag,
  IconGoGame,
  IconNotebook,
  IconDeviceGamepad,
  IconCash,
  IconCalendar
};

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
      id: 'admins',
      title: 'Administradores',
      type: 'item',
      url: '/main/admin-users',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'users',
      title: 'Usuarios',
      type: 'item',
      url: '/main/users',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'new-game',
      title: 'Eventos',
      type: 'item',
      url: '/main/new-game',
      icon: icons.IconCalendar,
      breadcrumbs: false
    },
    {
      id: 'game',
      title: 'BINGO',
      type: 'item',
      url: '/main/game',
      icon: icons.IconGoGame,
      breadcrumbs: false
    },
    {
      id: 'cards',
      title: 'Cartillas',
      type: 'item',
      url: '/main/card-game',
      icon: icons.IconCardboards,
      breadcrumbs: false
    },
    {
      id: 'cards-user',
      title: 'Asignar Cartillas',
      type: 'item',
      url: '/main/cards-user',
      icon: icons.IconNotebook,
      breadcrumbs: false
    },
    {
      id: 'payments',
      title: 'Pagos',
      type: 'item',
      url: '/main/payments',
      icon: icons.IconCash,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
