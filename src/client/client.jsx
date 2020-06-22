import React from 'react';
import ReactDOM from 'react-dom';
import ApplicationContainer from '../shared/components/Application/ApplicationContainer';
import './styles/main.scss';
import { config, gaUtils } from 'dgx-react-ga';

window.onload = () => {
  if (!window.ga) {
    const isProd = process.env.NODE_ENV === 'production';
    const gaOpts = { debug: !isProd, titleCase: false };

    gaUtils.initialize(config.google.code(isProd), gaOpts);
  }

  gaUtils.trackPageview(window.location.pathname);

  if (process.env.TEST_ENV === 'true') {
    var axe = require('react-axe');
    axe(React, ReactDOM, 1000);
  }

  ReactDOM.hydrate(
    <ApplicationContainer />,
    document.getElementById('nypl-library-card-app'),
  );
};
