// Polyfill Promise for legacy browsers
import 'babel-polyfill';
import FeatureFlags from 'dgx-feature-flags';
import React from 'react';
import { render } from 'react-dom';
import ApplicationContainer from '../shared/components/Application/ApplicationContainer';
import './styles/main.scss';

window.onload = () => {
  if (!window.dgxFeatureFlags) {
    window.dgxFeatureFlags = FeatureFlags.utils;
  }

  render(
    <ApplicationContainer />,
    document.getElementById('nypl-library-card-app'),
  );
};
