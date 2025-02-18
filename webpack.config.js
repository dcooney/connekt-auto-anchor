const path = require( 'path' );
const { merge } = require( 'webpack-merge' );

const config = {
	entry: {
		editor: path.resolve( __dirname, 'src/editor/index.js' ), 
	},
	output: {
		path: path.resolve( __dirname, 'build' ), 
	},
};

module.exports = merge(
	require( '@wordpress/scripts/config/webpack.config' ),
	config
);
