/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    inline: true, // refreshes the page on change
    open: true,
    port: 8080,
    historyApiFallback: {
      index: '/', // used for routing (404 response), and address bar routing
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled', // server mode displays report
    }),
  ],
  devtool: 'cheap-module-source-map',
});
