const { nxE2EStorybookPreset } = require('@nx/storybook/presets/cypress');
const { defineConfig } = require('cypress');

module.exports = defineConfig({
	e2e: nxE2EStorybookPreset(__dirname),
});
