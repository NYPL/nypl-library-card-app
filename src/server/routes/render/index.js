import React from 'react';
import { renderToString } from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import routes from './../../../shared/routes/routes.jsx';
import config from '../../../../appConfig';

export default function renderApp(req, res) {
  const isProduction = process.env.NODE_ENV === 'production';
  const csrfToken = req.csrfToken();

  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const html = renderToString(<RouterContext {...renderProps} />);
      const safePath = req.path.replace(/'/g, '').replace(/"/g, '');

      res
        .status(200)
        .render('index', {
          app: html,
          isProduction,
          path: safePath,
          appTitle: config.appTitle,
          favicon: config.favIconPath,
          csrfToken,
        });
    } else {
      res.status(404).send('Not found');
    }
  });
}
