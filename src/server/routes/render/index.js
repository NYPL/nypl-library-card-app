import React from 'react';
import { renderToString } from 'react-dom/server';
import { Route, RouterContext, match } from 'react-router';
import ApplicationContainer from '../../../shared/components/Application/ApplicationContainer';
import CardBarcodeContainer from '../../../shared/components/Application/CardBarcodeContainer';
import config from '../../../../appConfig';

export function renderApp(req, res) {
  const isProduction = process.env.NODE_ENV === 'production';
  const csrfToken = req.csrfToken();
  const routes = (
    <Route path='/library-card' component={ApplicationContainer}>
    </Route>
  );

  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      const html = renderToString(<RouterContext {...renderProps} />);
      const safePath = req.path.replace(/'/g, '').replace(/"/g, '')

      res
        .status(200)
        .render('index', {
          app: html,
          isProduction: isProduction,
          path: safePath,
          appTitle: config.appTitle,
          favicon: config.favIconPath,
          csrfToken,
        });
    } else {
      res.status(404).send('Not found')
    }
  });
}
