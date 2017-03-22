import React from 'react';
import { render } from 'react-dom';
import ApplicationContainer from '../shared/containers/Application/ApplicationContainer';
import './styles/main.scss';

window.onload = () => {
  render(
    <ApplicationContainer />,
    document.getElementById('nyplLibraryCardApp')
  );
};
