const path = require('path');
const webpack = require('webpack');
const CleanBuild = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const rootPath = path.resolve(__dirname);
const sassPaths = require('@nypl/design-toolkit').includePaths.map((sassPath) =>
  `includePaths[]=${sassPath}`
).join('&');

// PRODUCTION ENVIRONMENT CONFIG
if (process.env.NODE_ENV === 'production') {
  module.exports = {
    devtool: 'source-map',
    entry: [
      'babel-polyfill',
      'raf',
      path.resolve(rootPath, 'src/client/client.jsx'),
    ],
    output: {
      path: path.resolve(rootPath, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loaders: ['babel-loader'],
        },
        {
          test: /\.scss$/,
          include: path.resolve(rootPath, 'src'),
          loader: ExtractTextPlugin.extract(`css?sourceMap!sass?sourceMap&${sassPaths}`),
        },
      ],
    },
    plugins: [
      // Cleans the Dist folder after every build.
      // Alternately, we can run rm -rf dist/ as
      // part of the package.json scripts.
      new CleanBuild(['dist']),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
      new ExtractTextPlugin('styles.css'),
    ],
  };
} else {
  // DEVELOPMENT ENVIRONMENT CONFIG
  module.exports = {
    devtool: 'eval',
    entry: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      'babel-polyfill',
      'raf',
      path.resolve(rootPath, 'src/client/client.jsx'),
    ],
    output: {
      publicPath: 'http://localhost:3000/',
      path: path.resolve(rootPath, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.scss'],
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loaders: ['react-hot', 'babel-loader'],
        },
        {
          test: /\.scss?$/,
          loader: `style!css!sass?${sassPaths}`,
          include: path.resolve(rootPath, 'src'),
        },
      ],
    },
    plugins: [
      new CleanBuild(['dist']),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
  };
}
