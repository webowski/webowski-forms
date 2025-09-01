<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$initial_data = json_encode($attributes, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
$containerAttributes = [
	'class' => 'WebowskiForm',
	'data-initial' => esc_attr($initial_data),
];
?>

<div <?php echo get_block_wrapper_attributes( $containerAttributes ) ?>>
	<?php esc_html_e( 'Webowski Forms – hello from a dynamic block!', 'webowski-forms' ); ?>
</div>
