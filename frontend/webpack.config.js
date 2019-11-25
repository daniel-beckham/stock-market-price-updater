const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const path = require('path');

const isDevServer = process.argv.find(v => v.includes('webpack-dev-server'));

module.exports = {
  entry: ['./src/index.js'],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, '../backend/web/package/static/js'),
    publicPath: '/static/js/',
    filename: isDevServer ? '[name].bundle.js' : '[name].bundle.[contenthash].js',
    chunkFilename: isDevServer ? '[name].bundle.js' : '[name].bundle.[contenthash].js'
  },
  plugins: [
    new CleanWebpackPlugin(['../backend/web/package/static/js/*.js'], {
      root: path.resolve(__dirname, '../backend/web/package'),
      watch: true
    }),
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      filename: path.resolve(__dirname, '../backend/web/package/static/index.html'),
      template: path.resolve(__dirname, '../backend/web/package/templates/index.html')
    }),
    new HtmlWebpackHarddiskPlugin()
  ],
  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:5000'
      }
    },
    host: '0.0.0.0',
    port: 5001
  }
};
