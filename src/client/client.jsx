// Polyfill Promise for legacy browsers
import 'babel-polyfill';
// import FeatureFlags from 'dgx-feature-flags';
import React from 'react';
import { render } from 'react-dom';
// import { Router, useRouterHistory } from 'react-router';
import routes from '../shared/routes/routes.jsx';
// import createBrowserHistory from 'history/lib/createBrowserHistory';
import ApplicationContainer from '../shared/components/Application/ApplicationContainer';
// import BarcodeContainer from '../shared/components/BarcodeContainer/BarcodeContainer';
import './styles/main.scss';

window.onload = () => {
  // const appHistory = useRouterHistory(createBrowserHistory)();

  // if (!window.dgxFeatureFlags) {
  //   window.dgxFeatureFlags = FeatureFlags.utils;
  // }

  render(
    // <Router history={appHistory}>{routes}</Router>,
    <ApplicationContainer />,
    document.getElementById('nypl-library-card-app'),
  );
};
