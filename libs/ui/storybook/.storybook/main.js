const config = {
	stories: ['../../**/*.stories.@(js|jsx|ts|tsx|mdx)'],
	addons: [
		'@storybook/addon-essentials',
		'@storybook/addon-a11y',
		{
			name: '@storybook/addon-styling',
			// As recommended by addon, cannot use addon options with angular
			// Check out https://github.com/storybookjs/addon-styling/blob/main/docs/api.md
		},
	],
	framework: {
		name: '@storybook/angular',
		options: {},
	},
	staticDirs: ['../public'], //👈 Configures the static asset folder in Storybook
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/packages/storybook/documents/custom-builder-configs
