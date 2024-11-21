import { ExecutorContext } from '@nx/devkit';
import * as process from 'node:process';
import * as replaceJsonProp from 'replace-json-property';
import * as projectHelpers from '../helpers/projects.helpers';
import executor from './executor';

// Mock the entire replace-json-property module
jest.mock('replace-json-property', () => ({
	replace: jest.fn(), // Mock the replace function
}));

describe('ReplaceVersion Executor', () => {
	it('should replace the version within the default path if no path was provided', async () => {
		const version = '2.0.0';
		const libName = 'foo';
		const mockContext = {} as unknown as ExecutorContext;

		process.env.VERSION = version;

		const root = `libs/${libName}`;

		// Mock the getRoot helper
		jest.spyOn(projectHelpers, 'getRoot').mockReturnValue(root);

		const output = await executor({}, mockContext);

		// Check that the replace function was called correctly
		expect(replaceJsonProp.replace).toHaveBeenCalledWith(`${root}/package.json`, 'version', version);
		expect(output.success).toBe(true);
	});
});
