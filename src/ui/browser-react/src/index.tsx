import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { withTheme } from './views/shared/theme-factory'
import reportWebVitals from './reportWebVitals';
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

ReactDOM.render(rootContent, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
