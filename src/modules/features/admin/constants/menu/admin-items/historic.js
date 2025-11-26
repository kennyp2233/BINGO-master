// assets
import { IconFileReport } from '@tabler/icons';

// constant
const icons = { IconFileReport };

const historic = {
  id: 'historic',
  title: 'Logs',
  type: 'group',
  children: [
    {
      id: 'logs',
      title: 'Logs',
      type: 'item',
      url: '/main/logs',
      icon: icons.IconFileReport,
      breadcrumbs: false
    }
  ]
};

export default historic;
