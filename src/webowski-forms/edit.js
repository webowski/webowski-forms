import { __ } from '@wordpress/i18n'
import { useBlockProps } from '@wordpress/block-editor'
// import { CheckboxControl, TextControl } from '@wordpress/components'
import './editor.scss'

export default function Edit() {
	return (
		<p { ...useBlockProps() }>
			{ __(
				'Webowski Forms – hello from the editor!',
				'webowski-forms'
			) }
		</p>
	)
}
