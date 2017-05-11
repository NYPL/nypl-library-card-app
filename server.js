import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import path from 'path';
import express from 'express';
import compress from 'compression';
import bodyParser from 'body-parser';
import colors from 'colors';
import helmet from 'helmet';
import logger from './src/server/logger';

// Api Routes
import { initializeAppAuth, createPatron } from './src/server/routes/api';
// App Routes
import renderApp from './src/server/routes/render';
// App Config File
import appConfig from './appConfig';
// Global Configuration Variables
const rootPath = __dirname;
const distPath = path.resolve(rootPath, 'dist');
const viewsPath = path.resolve(rootPath, 'src/views');
const isProduction = process.env.NODE_ENV === 'production';

/* Express Server Configurations
 * -----------------------------
 */
const app = express();
// HTTP Security Headers
app.use(helmet({
  noCache: false,
  referrerPolicy: { policy: 'origin-when-cross-origin' },
}));

app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sets the server path to /dist
app.use('/library-card/new', express.static(distPath));
app.use(cookieParser());

// Disables the Server response from displaying Express as the server engine
app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', viewsPath);
app.set('port', process.env.PORT || appConfig.port);
app.set('logger', logger);

// CSRF Protection Middleware
app.use(csrf({ cookie: true }));
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }

  return res.status(400).json({
    status: 400,
    response: {
      type: 'invalid-csrf-token',
      message: 'The current CSRF token is invalid',
      details: err,
    },
  });
});

app.get('/', (req, res) => {
  res.redirect('/library-card/new');
});

// GET route displays LibraryCard App
app.get('/library-card/new', renderApp);

// GET route displays patron's barcode
app.get('/library-card/new/barcode', renderApp);

// POST route used to submit LibraryCard params
app.post('/library-card/new/create-patron', initializeAppAuth, createPatron);

const server = app.listen(app.get('port'), (error) => {
  if (error) {
    app.get('logger').error(error);
  } else {
    app.get('logger').info(`Express server for ${appConfig.appName} is listening at ${app.get('port')}`);
  }
});

// This function is called when you want the server to die gracefully
// i.e. wait for existing connections
const gracefulShutdown = () => {
  app.get('logger').info('Received kill signal, shutting down gracefully.');
  server.close(() => {
    app.get('logger').info('Closed out remaining connections.');
    process.exit(0);
  });
  // if after
  setTimeout(() => {
    app.get('logger').error('Could not close connections in time, forcefully shutting down');
    process.exit();
  }, 1000);
};
// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);
// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);

/* Development Environment Configuration
 * -------------------------------------
 * - Using Webpack Dev Server
 */
if (!isProduction) {
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const webpackConfig = require('./webpack.config.js');

  new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    stats: false,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3001',
      'Access-Control-Allow-Headers': 'X-Requested-With',
    },
  }).listen(appConfig.webpackDevServerPort, 'localhost', (error) => {
    if (error) {
      app.get('logger').error(error);
    } else {
      app.get('logger').info(`Webpack Dev Server listening at ${appConfig.webpackDevServerPort}`)
    }
    ;
  });
}