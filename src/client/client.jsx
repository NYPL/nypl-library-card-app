// Polyfill Promise for legacy browsers
import 'babel-polyfill';
import FeatureFlags from 'dgx-feature-flags';
import React from 'react';
import { render } from 'react-dom';
import ApplicationContainer from '../shared/components/Application/ApplicationContainer';
import './styles/main.scss';
import { gaUtils } from 'dgx-react-ga';

window.onload = () => {
  if (!window.dgxFeatureFlags) {
    window.dgxFeatureFlags = FeatureFlags.utils;
  }

  if (!window.ga) {
    const gaOpts = { debug: false, titleCase: false };

    gaUtils.initialize('UA-1420324-3', gaOpts);
  }

  render(
    <ApplicationContainer />,
    document.getElementById('nypl-library-card-app'),
  );
};
