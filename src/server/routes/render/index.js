import React from 'react';
import { renderToString } from 'react-dom/server';
import ApplicationContainer from '../../../shared/containers/Application/ApplicationContainer';
import config from '../../../../appConfig';

export function renderApp(req, res, next) {
  const isProduction = process.env.NODE_ENV === 'production';
  const app = renderToString(<ApplicationContainer />);

  return res.render('index', {
    app,
    isProduction,
    appTitle: config.appTitle,
    favicon: config.favIconPath,
  });
}
