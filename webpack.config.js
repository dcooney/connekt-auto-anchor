const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require( 'webpack-merge' );

const config = {
	entry: {
		editor: path.resolve( __dirname, 'src/editor/index.js' ), 
	},	
	optimization: {
		minimize: false,
		minimizer: [
			new TerserPlugin({
				extractComments: false,
				test: /\.min.js(\?.*)?$/i,
			}),
		],
	},
};

module.exports = merge(
	require( '@wordpress/scripts/config/webpack.config' ),
	config
);
