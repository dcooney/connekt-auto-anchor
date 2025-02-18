<?php
/**
 * Plugin Name: Connekt Auto Anchor
 * Plugin URI: https://connekthq.com
 * Description: A microplugin for auto generating anchor links from block content.
 * Version: 1.0.0 
 * Author: Darren Cooney
 * Author URI: https://connekthq.com
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: connekt-auto-anchor
 * Domain Path: /languages
 * 
 * @package Connekt
 */

defined( 'ABSPATH' ) || exit;

/**
 * Plugin initialization class
 */
class ConnektAutoAnchor_Plugin {
    /**
     * Constructor
     */
    public function __construct() {
        $this->define_constants();
        $this->init_hooks();
    }

    /**
     * Define plugin constants
     */
    private function define_constants() {
        define( 'CONNEKT_AUTO_ANCHOR_VERSION', '1.0.0' ); 
    }

    /**
     * Initialize hooks
     */
    private function init_hooks() {
        add_action( 'init', array( $this, 'load_textdomain' ) );
        add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );
    }

    /**
     * Load plugin textdomain
     */
    public function load_textdomain() {
        load_plugin_textdomain( 'cnkt', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
    }

    /**
     * Enqueue editor assets
     */
    public function enqueue_editor_assets() {
        $asset_file = include( plugin_dir_path( __FILE__ ) . 'build' . '/editor.asset.php' );
        
        wp_enqueue_script(
            'connekt-auto-anchor',
            plugin_dir_url( __FILE__ ) . 'build' . '/editor.js',
            $asset_file['dependencies'],
            $asset_file['version']
        );

        wp_localize_script(
            'connekt-auto-anchor',
            'connektAutoAnchor',
            array(
                'pluginDir'   => plugin_dir_url( __FILE__ ), 
                'buttonLabel' => apply_filters( 'connekt_auto_anchor_button_label', __( 'Generate Anchor', 'connekt-auto-anchor' ) ),
                'supported'   => apply_filters( 'connekt_auto_anchor_supported', [ 
                    'core/heading', 
                    'core/paragraph' 
                    ] 
                ),
                'maxLength'   => apply_filters( 'connekt_auto_anchor_max_length', 30 ),
            )
        );

        wp_set_script_translations( 'connekt-auto-anchor', 'connekt-auto-anchor' );
    }
}

// Initialize plugin
new ConnektAutoAnchor_Plugin();
