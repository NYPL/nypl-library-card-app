import { createFactory } from 'react';
import { renderToString } from 'react-dom/server';
import ApplicationContainer from '../../../shared/containers/Application/ApplicationContainer';
import config from '../../../../appConfig';

export default function renderApp(req, res) {
  const isProduction = process.env.NODE_ENV === 'production';
  const componentFactory = createFactory(ApplicationContainer);
  const app = renderToString(componentFactory());
  const csrfToken = req.csrfToken();

  return res.render('index', {
    app,
    isProduction,
    appTitle: config.appTitle,
    favicon: config.favIconPath,
    csrfToken,
  });
}
