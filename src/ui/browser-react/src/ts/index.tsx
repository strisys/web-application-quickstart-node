import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { withTheme } from './views/shared/theme-factory'
import RouteViewContainer from './views/route/ViewContainer';

const rootContent = (
  <React.StrictMode>
    {withTheme(
      <React.Fragment>
        <CssBaseline />
        <RouteViewContainer />
      </React.Fragment>
    )}
  </React.StrictMode>
);

ReactDOM.render(rootContent, document.getElementById('react-root'));
