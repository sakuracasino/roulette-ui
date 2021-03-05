const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const APP_DIR = './src';
const BUILD_DIR = 'dist';

module.exports = {
  entry: `${APP_DIR}/index.tsx`,
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, BUILD_DIR),
    compress: true,
    open: true,
    hot: true,
    port: 9000,
  },
  output: {
    path: path.join(__dirname, BUILD_DIR),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new ESLintPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new htmlWebpackPlugin({
      template: `${APP_DIR}/index.html`,
      filename: `index.html`,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
}
