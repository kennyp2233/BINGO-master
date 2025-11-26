// assets
import { IconBell, IconSettings, IconMailbox, IconMail } from '@tabler/icons';

// constant
const icons = {
  IconMailbox,
  IconSettings,
  IconMail,
  IconBell
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Configuraciones',
  type: 'group',
  children: [
    {
      id: 'settings',
      title: 'Parámetros',
      type: 'item',
      url: '/main/settings',
      icon: icons.IconSettings
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      type: 'item',
      url: '/main/notifications',
      icon: icons.IconBell
    }
  ]
};

export default pages;
