// Polyfill Promise for legacy browsers
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import ApplicationContainer from '../shared/components/Application/ApplicationContainer';
import './styles/main.scss';

window.onload = () => {
  render(
    <ApplicationContainer />,
    document.getElementById('nypl-library-card-app'),
  );
};
