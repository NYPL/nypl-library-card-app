const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanBuild = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// Sets appEnv so the the header component will point to the search app on either Dev or Prod
const appEnv = process.env.APP_ENV ? process.env.APP_ENV : 'production';
const rootPath = path.resolve(__dirname);
const sassPaths = require('@nypl/design-toolkit')
  .includePaths.map((sassPath) => `includePaths[]=${sassPath}`)
  .join('&');

// Because we run webpack in `prestart`, we should ensure that NODE_ENV agrees
// with whatever's in `.env`. The following code is essentially the first thing
// the server does when it starts up locally, so if our webpack build doesn't
// do the same thing, the local server may start up in NODE_ENV production
// while webpack starts up in 'development'.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: [path.resolve(rootPath, 'src/client/client.jsx')],
    output: {
      path: path.resolve(rootPath, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
          },
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loaders: ['babel-loader'],
        },
        {
          test: /\.scss?$/,
          loader: `style-loader!css-loader!sass-loader?${sassPaths}`,
          include: path.resolve(rootPath, 'src'),
        },
      ],
    },
    plugins: [
      // Cleans the Dist folder after every build.
      // Alternately, we can run rm -rf dist/ as
      // part of the package.json scripts.
      new CleanBuild(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        appEnv: JSON.stringify(appEnv),
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new MiniCssExtractPlugin('styles.css'),
    ],
  };
} else {
  // DEVELOPMENT ENVIRONMENT CONFIG
  module.exports = {
    mode: 'development',
    devtool: 'eval',
    entry: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      path.resolve(rootPath, 'src/client/client.jsx'),
    ],
    output: {
      publicPath: 'http://localhost:3000/',
      path: path.resolve(rootPath, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.scss'],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loaders: ['react-hot-loader/webpack', 'babel-loader'],
        },
        {
          test: /\.scss?$/,
          loader: `style-loader!css-loader!sass-loader?${sassPaths}`,
          include: path.resolve(rootPath, 'src'),
        },
      ],
    },
    plugins: [
      new CleanBuild(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        appEnv: JSON.stringify(appEnv),
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
  };
}
