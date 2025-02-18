import { InspectorAdvancedControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

const withConnektAnchorControls = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			const { attributes, setAttributes, name } = props;
			const { supported = [], maxLength = 30, buttonLabel = __("Generate", 'connekt-auto-anchor') } = connektAutoAnchor;

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
			}

			return (
				<Fragment>
					<BlockEdit { ...props } />
					<InspectorAdvancedControls>
						<button className="button button-primary" onClick={() => generateAnchor(attributes)}>
							{buttonLabel}
						</button>						
					</InspectorAdvancedControls>
				</Fragment>
			);
		};
	}
);

addFilter(
	'editor.BlockEdit',
	'connekt/inspector-controls',
	withConnektAnchorControls
);
