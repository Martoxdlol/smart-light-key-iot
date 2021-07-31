var path = require('path');
var webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs-extra');
fs.copySync(path.resolve(__dirname, './build/index.html'), path.resolve(__dirname, './dist/index.html'));
fs.copySync(path.resolve(__dirname, './build/assets'), path.resolve(__dirname, './dist/assets'));

module.exports = {
 entry: './src/index.js',
 mode: 'production',
 target: ['web', 'es5'],
 output: {
   path: path.resolve(__dirname, 'dist'),
   filename: 'app.bundle.js'
 },
 plugins: [new MiniCssExtractPlugin({
   filename: 'app.css'
 })],
 module: {
   rules: [
     { test: /\.js/, use: 'babel-loader' },
     {
       test: /\.css$/i,
       use: [{
         loader: MiniCssExtractPlugin.loader,
         options: {
           publicPath: path.join(__dirname, 'dist'),
         },
       }, 'css-loader'],
       sideEffects: true,
     },
   ]
 },
 stats: {
     colors: true
 },
 // devtool: 'source-map',
 //   devServer: {
 //    contentBase: path.join(__dirname, 'build'),
 //    compress: true,
 //    port: 9000,
 //    host: '0.0.0.0',
 //    disableHostCheck: true
 //  },
};
