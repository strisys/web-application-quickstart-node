import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import { TasksViewContainer } from '../../features/task-management/ViewContainer';
import { SalesEntryContainer } from '../../features/sales/ViewContainer';
import { FourOFourViewContainer }  from '../../features/404/ViewContainer';

export class MenuItem {
  constructor(public key: string, public name: string, public path: string, public element: JSX.Element, public icon: JSX.Element = null, public showInMenu = true) {
  }
}

export const routeList: MenuItem[] = [
  new MenuItem('root', 'Tasks', '/', <TasksViewContainer />, null, false),
  new MenuItem('tasks', 'Tasks', '/tasks', <TasksViewContainer />, <InboxIcon />),
  new MenuItem('sales', 'Sales', '/sales', <SalesEntryContainer />, <MailIcon />),
  new MenuItem('404', '404', '*', <FourOFourViewContainer />, null, false)
]

export const menuList: MenuItem[] = routeList.filter((r) => r.showInMenu)