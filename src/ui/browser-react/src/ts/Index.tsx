import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { withTheme } from './views/shared/theme-factory'
import RouteViewContainer from './views/shared/navigation/RouterViewContainer';
import { getValue } from './views/shared/kv';

// import 'devextreme/dist/css/dx.common.css';
// import 'devextreme/dist/css/dx.light.css';

const rootContent = (
  <React.StrictMode>
    {withTheme(
      <React.Fragment>
        <CssBaseline />
        <RouteViewContainer appTitle={getValue('app-title').value} />
      </React.Fragment>
    )}
  </React.StrictMode>
);

ReactDOM.render(rootContent, document.getElementById('react-root'));
