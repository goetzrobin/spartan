import { withThemeByDataAttribute } from '@storybook/addon-styling';

export const decorators = [
	withThemeByDataAttribute({
		themes: {
			light: 'light',
			dark: 'dark',
		},
		defaultTheme: 'light',
		attributeName: 'data-mode',
	}),
];

const preview = {
	parameters: {
		options: {
			storySort: {
				method: 'alphabetical',
			},
		},
	},
};

export default preview;
