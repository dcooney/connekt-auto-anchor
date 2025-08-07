<?php
/**
 * Plugin Name: Easy Anchor
 * Plugin URI:  https://connekthq.com
 * Description: A microplugin for dynamically generating anchor links from block content.
 * Author:      Darren Cooney
 * Author URI:  https://connekthq.com
 * License:     GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: easy-anchor
 * Version:     1.0.0
 * 
 * @package EasyAnchor
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

/**
 * Plugin initialization class
 */
class Easy_Anchor_Plugin {
    /**
     * Constructor
     */
    public function __construct() {
        $this->define_constants();
        $this->actions();
    }

    /**
     * Define plugin constants.
     */
    private function define_constants() {
        define( 'EASY_ANCHOR_VERSION', '1.0.0' ); 
    }

    /**
     * Initialize action hooks.
     */
    private function actions() {
        add_action( 'init', [ $this, 'load_textdomain' ] );
        add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_editor_assets' ] );
    }

    /**
     * Load plugin textdomain.
     */
    public function load_textdomain() {
        load_plugin_textdomain( 'easy-anchor', false, dirname( plugin_basename( __FILE__ ) ) . '/lang' );
    }

    /**
     * Enqueue editor assets.
     */
    public function enqueue_editor_assets() {
        $asset_file = include( plugin_dir_path( __FILE__ ) . 'build' . '/editor.asset.php' );
        
        wp_enqueue_script(
            'easy-anchor',
            plugin_dir_url( __FILE__ ) . 'build' . '/editor.js',
            $asset_file['dependencies'],
            $asset_file['version']
        );

        wp_localize_script(
            'easy-anchor',
            'easyAnchor',
            [
                'pluginDir'   => plugin_dir_url( __FILE__ ), 
                'supported'   => apply_filters( 'easy_anchor_supported', [ 
                    'core/heading', 
                    'core/paragraph' 
                    ] 
                ),
                'maxLength'   => apply_filters( 'easy_anchor_max_length', 30 ),
            ]
        );

        wp_set_script_translations( 'easy-anchor', 'easy-anchor' );
    }
}
if ( ! class_exists( 'Easy_Anchor_Plugin' ) ) {
    new Easy_Anchor_Plugin(); // Initialize plugin. 
}
