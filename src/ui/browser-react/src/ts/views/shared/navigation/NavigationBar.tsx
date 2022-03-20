
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { NavLink, useNavigate } from "react-router-dom";
import { menuList, MenuItem } from './RouteList';

type EventType = ('menuItemSelected' | 'drawerOpen' | 'drawerClose');

function DrawerMenuList(props: { onEvent: (e: any, name: EventType) => void }) {  
  let navigate = useNavigate();

  const onClick = (e: any, item: MenuItem) => {
    navigate(item.path);
    props.onEvent(e, 'menuItemSelected');
  }

  return (
    <React.Fragment>
      <List>
        {menuList.map((item) => (
          <ListItem button key={item.name} onClick={(e) => onClick(e, item)}>
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );
}

function NavigationAppBar(props: { onEvent: (e: any, name: EventType) => void}) {  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            <NavLink style={{ color:'inherit', textDecoration: 'inherit' }} to={`/`}>My App</NavLink>
          </Typography>
          <IconButton onClick={(e) => props.onEvent(e, 'drawerOpen')}  size='large'edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function NavigationBar(props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; }) {  
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const onEvent = (_, name: EventType) => {
    if (name.startsWith('drawer')) {
      setDrawerOpen(name.includes('Open'));
    }

    if (name === 'menuItemSelected') {
      const handle = setTimeout(() => {
        clearTimeout(handle);
        setDrawerOpen(false);
      }, 700);
    }
  }

  return (
    <React.Fragment>
      <Drawer anchor={'right'} open={drawerOpen} onClose={(e) => onEvent(e, 'drawerClose')}>
        <DrawerMenuList onEvent={onEvent} />
      </Drawer>
      <NavigationAppBar onEvent={onEvent} />
      {props.children}
    </React.Fragment>
  );
}

export const withNavigation = (component: JSX.Element): JSX.Element => {
  return (
    <NavigationBar>
      {component}
    </NavigationBar>
  )
}