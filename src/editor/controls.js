import { BlockControls, InspectorAdvancedControls } from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { dispatch } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * HOC for adding a `Generate Anchor` button to the block toolbar.
 */
const addEasyAnchorControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { setAttributes, attributes, name } = props;
		const { supported = [], maxLength = 30 } = easyAnchor || {}; 

		if (!supported.includes(name)) {
			return <BlockEdit { ...props } /> // Return the original block if it's not supported
		}
		 
		/**
		 * Sanitize the title to generate an anchor
		 * @param {string} str The title to sanitize
		 * @return {string}	  The sanitized title
		 */
		function sanitizeTitle(str) { 
			if (!str) {
				return ''
			}
			str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
			str = str.toLowerCase(); // convert string to lowercase
			str = str.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
						.replace(/\s+/g, '-') // replace spaces with hyphens
						.replace(/-+/g, '-'); // remove consecutive hyphens							
			return str.substring(0, maxLength); // limit to 30 characters
		}

		/**
		 * Generate an anchor based on the content of the block
		 * @param {object} attributes The block attributes
		 */
		function generateAnchor(attributes) {
			const content = attributes?.content?.text || '';
			const anchor = sanitizeTitle(content);
			setAttributes({
				anchor: anchor
			})

			// Show snackbar message.
			dispatch('core/notices').createNotice(
				'success', // Can be one of: success, info, warning, error.
				__('HTML Anchor set for block.', 'easy-anchor'),
				{
					type: 'snackbar',
					isDismissible: true,
				}
			);
		}

		/**
		 * Icon (#) component for the toolbar button.
		 * @return {Element} The Icon component.
		 */
		function Icon() {
			return (
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{width:'16px', height:'16px'}}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
				</svg>
			)
		}

		return (
			<Fragment>
				<BlockEdit {...props} />
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							icon={ Icon }
							label={__('Generate Anchor', 'easy-anchor')}
							onClick={ () => generateAnchor(attributes) }
						/>
					</ToolbarGroup>
				</BlockControls>
			</Fragment>
		); 
	};
}, 'withBlockControls');

addFilter('editor.BlockEdit', 'easy-anchor/controls', addEasyAnchorControls);
