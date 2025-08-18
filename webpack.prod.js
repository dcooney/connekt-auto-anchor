const path = require( 'path' ); 
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

const config = merge(common, {
	entry: {
		'editor.min': path.resolve( __dirname, 'src/editor/index.js' ), 
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: true,
				test: /\.min.js(\?.*)?$/i,
			}),
		],
	},
}); 

module.exports = config;
