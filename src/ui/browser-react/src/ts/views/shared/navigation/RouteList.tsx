import ManageSearchTwoToneIcon from '@mui/icons-material/ManageSearchTwoTone';
import PlaylistAddCheckTwoToneIcon from '@mui/icons-material/PlaylistAddCheckTwoTone';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';

import { SearchViewContainer } from '../../features/search/ViewContainer';
import { TasksViewContainer } from '../../features/task-management/ViewContainer';
import { SalesEntryContainer } from '../../features/sales/ViewContainer';
import { FourOFourViewContainer } from '../../features/404/ViewContainer';

export class MenuItem {
  constructor(public key: string, public name: string, public path: string, public element: JSX.Element, public icon: JSX.Element = null, public showInMenu = true) {
  }
}

export const routeList: MenuItem[] = [
  new MenuItem('root', 'Sales', '/', <SalesEntryContainer />, null, false),
  // new MenuItem('search', 'Search', '/search', <SearchViewContainer />, <ManageSearchTwoToneIcon />),
  new MenuItem('tasks', 'Tasks', '/tasks', <TasksViewContainer />, <PlaylistAddCheckTwoToneIcon />),
  new MenuItem('sales', 'Sales', '/sales', <SalesEntryContainer />, <MonetizationOnTwoToneIcon />),
  new MenuItem('404', '404', '*', <FourOFourViewContainer />, null, false),
];

export const menuList: MenuItem[] = routeList.filter((r) => r.showInMenu);
