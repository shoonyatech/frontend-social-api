import webpack from 'webpack';
import config from './webpack.config.babel';

config.plugins = config.plugins || [];
config.plugins.push(new webpack.optimize.UglifyJsPlugin());

delete config['devtool'];

module.exports = config;
