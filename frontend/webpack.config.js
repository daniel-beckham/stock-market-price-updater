const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const mode = process.argv[process.argv.indexOf('--mode') + 1] || 'development';
const subdirectory = process.env.SUBDIRECTORY || '';

module.exports = {
  entry: ['./src/index.jsx'],
  output: {
    path: path.resolve(__dirname, '../backend/website/static/js'),
    publicPath: subdirectory + '/static/js/',
    filename:
      mode === 'development'
        ? '[name].bundle.js'
        : '[name].bundle.[contenthash].js',
    chunkFilename:
      mode === 'development'
        ? '[name].bundle.js'
        : '[name].bundle.[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      SUBDIRECTORY: '',
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(
        __dirname,
        '../backend/website/static/index.html'
      ),
      template: path.resolve(
        __dirname,
        '../backend/website/templates/index.html'
      ),
      inject: false,
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
    new CleanWebpackPlugin(),
  ],
  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:5000',
      },
    },
    host: '0.0.0.0',
    port: 5001,
  },
  performance: {
    hints: false,
  },
};
