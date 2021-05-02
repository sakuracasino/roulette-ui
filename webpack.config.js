require('dotenv').config()
const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const APP_DIR = './src';
const BUILD_DIR = 'dist';

module.exports = {
  entry: `${APP_DIR}/index.tsx`,
  mode: 'development',
  devtool: 'source-map',
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
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/ethereum-cryptography'),
        ],
        use: ['babel-loader'],
      },
      
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|woff|woff2|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[hash].[ext]',
              outputPath: 'assets',
            },
          }
        ],
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    modules: [APP_DIR, './node_modules'],
    fallback: {
      'https': false,
      'http': false,
      'crypto': false,
      'assert': false,
      'os': false,
      'stream': false,
      'Buffer': false,
    },
  },
  plugins: [
    new ESLintPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new htmlWebpackPlugin({
      template: `${APP_DIR}/index.html`,
      filename: `index.html`,
      favicon: './src/assets/roulette-logo.svg',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG),
      'process.env.BET_TOKEN_ADDRESS': JSON.stringify(process.env.BET_TOKEN_ADDRESS),
      'process.env.ROULETTE_ADDRESS': JSON.stringify(process.env.ROULETTE_ADDRESS),
      'process.env.BET_TOKEN_NAME': JSON.stringify(process.env.BET_TOKEN_NAME || 'DAI'),
    }),
  ],
}
