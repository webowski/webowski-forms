<?php
/**
 * Plugin Name:       Webowski Forms
 * Description:       Example block scaffolded with Create Block tool.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       webowski-forms
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using a `blocks-manifest.php`
 */
function create_block_webowski_forms_block_init() {
	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
	 * based on the registered block metadata.
	 */
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		return;
	}

	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` file.
	 */
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}
	/**
	 * Registers the block type(s) in the `blocks-manifest.php` file.
	 */
	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', 'create_block_webowski_forms_block_init' );


/**
 * Ajax обработчик
 */
add_action( 'wp_ajax_webowski_send_email', 'webowski_forms_send_email' );
add_action( 'wp_ajax_nopriv_webowski_send_email', 'webowski_forms_send_email' );


/**
 *
 */
function webowski_forms_send_email() {
	check_ajax_referer( 'webowski_forms_nonce', 'nonce' );

	$name    = sanitize_text_field( $_POST['name'] ?? '' );
	$email   = sanitize_email( $_POST['email'] ?? '' );
	$message = sanitize_textarea_field( $_POST['message'] ?? '' );

	if ( ! $name || ! $email || ! $message ) {
		wp_send_json_error( [ 'message' => 'Заполните все поля' ] );
	}

	$to      = get_option( 'admin_email' );
	$subject = "Сообщение от $name";
	$headers = [ "Reply-To: $name <$email>" ];

	$sent = wp_mail( $to, $subject, $message, $headers );

	if ( $sent ) {
		wp_send_json_success( [ 'message' => 'Сообщение отправлено!' ] );
	} else {
		wp_send_json_error( [ 'message' => 'Ошибка при отправке' ] );
	}
}


/**
 * Проброс ajax_url и nonce в React
 */
add_action( 'wp_enqueue_scripts', function() {
	wp_localize_script( 'webowski-forms-view', 'webowskiForms', [
		'ajax_url' => admin_url( 'admin-ajax.php' ),
		'nonce'    => wp_create_nonce( 'webowski_forms_nonce' ),
	] );
});
