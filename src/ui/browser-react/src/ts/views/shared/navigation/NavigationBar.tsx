import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import CropFreeTwoToneIcon from '@mui/icons-material/CropFreeTwoTone';
import ExitToAppTwoToneIcon from '@mui/icons-material/ExitToAppTwoTone';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { NavLink, useNavigate } from 'react-router-dom';
import { menuList, MenuItem } from './RouteList';
import { AppBrand } from './AppBrand';
import Headroom from 'headroom.js';

type EventType = ('menuItemSelected' | 'drawerOpen' | 'drawerClose' | 'fullScreen' | 'logout');

function DrawerMenuList(props: { onEvent: (e: any, name: EventType) => void }) {
  let navigate = useNavigate();

  const onClick = (e: any, item: MenuItem) => {
    navigate(item.path);
    props.onEvent(e, 'menuItemSelected');
  };

  return (
    <Box sx={{ minWidth: 200 }} role='presentation'>
      <List>
        {menuList.map((item) => (
          <ListItem
            key={`drawer-list-item-${item.name}`}
            button
            onClick={(e) => onClick(e, item)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

function NavigationAppBar(props: { title: string; onEvent: (e: any, name: EventType) => void}) {
  const configureHeadroom = () => {
    const elem = document.getElementById('navigation-app-bar');

    if (elem) {
      const config = {
        offset: 205,
        tolerance: 5,
        classes: {
          initial: 'animated',
          pinned: 'slideDown',
          unpinned: 'slideUp',
        },
      };

      new Headroom(elem, config).init();
      console.log('headroom initialized');
    }
  };

  setTimeout(configureHeadroom, 5000);

  return (
    <Box id='navigation-app-bar' sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            <NavLink style={{ color: 'inherit', textDecoration: 'inherit' }} to={`/`}>
              <AppBrand title={props.title} />
            </NavLink>
          </Typography>
          <IconButton onClick={(e) => props.onEvent(e, 'drawerOpen')} size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
            <MenuTwoToneIcon />
          </IconButton>
          <IconButton onClick={(e) => props.onEvent(e, 'fullScreen')} size='large' edge='start' color='inherit'  aria-label='full-screen' sx={{ mr: 2 }}>
            <CropFreeTwoToneIcon />
          </IconButton>
          <IconButton onClick={(e) => props.onEvent(e, 'logout')} size='large' edge='start' color='inherit'  aria-label='full-screen' sx={{ mr: 2 }}>
            <ExitToAppTwoToneIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function createDelay(func: (...args: any[]) => any, milliseconds: number = 700) {
  return function wrapper(...args: any[]) {
    const handle = setTimeout(() => {
      clearTimeout(handle);
      func(...args);      // spread args
    }, milliseconds);
  };
}

export type NavigationPageProps = { title: string; children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal }

function NavigationPage(props: NavigationPageProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [fullScreen, setFullScreen] = React.useState(false);

  const onEvent = (_, name: EventType) => {
    if (name.startsWith('drawer')) {
      setDrawerOpen(name.includes('Open'));
    }

    if (name === 'menuItemSelected') {
      createDelay(setDrawerOpen)(false);
      
      // const handle = setTimeout(() => {
      //   clearTimeout(handle);
      //   setDrawerOpen(false);
      // }, 700);
    }

    if (name === 'logout') {
      createDelay(() => document.location = '/logout')();
    }

    if (name === 'fullScreen') {
      const toggleFullscreen = () => {
        const element = document.querySelector('body');
        setFullScreen(!fullScreen);

        if (!fullScreen) {
          return element?.requestFullscreen();
        }

        return document.exitFullscreen();
      }

      createDelay(toggleFullscreen, 100)(fullScreen);
    }
  };

  return (
    <React.Fragment>
      <Drawer anchor={'right'} open={drawerOpen} onClose={(e) => onEvent(e, 'drawerClose')}>
        <DrawerMenuList onEvent={onEvent} />
      </Drawer>
      <NavigationAppBar title={props.title} onEvent={onEvent} />
      {props.children}
    </React.Fragment>
  );
}

export const withNavigation = (title: string, content: JSX.Element): JSX.Element => {
  return <NavigationPage title={title}>{content}</NavigationPage>;
};
