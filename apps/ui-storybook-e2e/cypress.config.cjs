import { nxE2EStorybookPreset } from '@nx/storybook/presets/cypress';
import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: nxE2EStorybookPreset(__dirname),
});
