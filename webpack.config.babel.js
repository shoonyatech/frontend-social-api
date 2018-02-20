import path from 'path';
import fs from 'fs';

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(file => ['.bin'].indexOf(file) === -1)
  .forEach(file => nodeModules[file] = 'commonjs ' + file);

module.exports = {
  entry: ['babel-polyfill', './server.js'],
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.build.js'
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: nodeModules,
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', query: { presets: ['env'] }, exclude: /node_modules/ },
      { test: /\.js$/, loader: 'eslint-loader', query: { presets: ['env'] }, exclude: /node_modules/ }
    ]
  },
  stats: { colors: true },
  devtool: 'sourcemap'
};
