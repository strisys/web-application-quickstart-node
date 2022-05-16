import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { withNavigation } from './NavigationBar';
import { routeList } from './RouteList'

// https://github.com/remix-run/react-router/blob/main/docs/getting-started/tutorial.md
function RouteViewContainer(props: { appTitle: string,  }) {
  const routes: Array<React.ReactNode> = routeList.map((item) => (
    <Route key={item.key} path={item.path} element={item.element} />
  ));

  return (
    <React.Fragment>
      <BrowserRouter>
        { withNavigation(props.appTitle, <Routes>{routes}</Routes> )}
      </BrowserRouter>
    </React.Fragment>
  )
}

export default RouteViewContainer;
