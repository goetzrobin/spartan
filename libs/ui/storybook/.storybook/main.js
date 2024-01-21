const config = {
	stories: ['../../**/*.stories.@(js|jsx|ts|tsx|mdx)'],
	addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', '@storybook/addon-styling'],
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
