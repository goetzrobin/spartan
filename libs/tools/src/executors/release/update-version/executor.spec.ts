import * as process from 'node:process';
import * as replaceJsonProp from 'replace-json-property';

import * as projectHelpers from '../helpers/projects.helpers';

import executor from './executor';

describe('ReplaceVersion Executor', () => {
	it('should replace the version with in the default path if no path was provided', async () => {
		const version = '2.0.0';
		const libName = 'foo';
		const mockContext = {} as any;

		process.env.VERSION = version;

		const root = `libs/${libName}`;

		// eslint-disable-next-line @typescript-eslint/no-empty-function
		jest.spyOn(replaceJsonProp, 'replace').mockImplementation(() => {});
		jest.spyOn(projectHelpers, 'getRoot').mockReturnValue(root);

		const output = await executor({}, mockContext);

		expect(replaceJsonProp.replace).toHaveBeenCalledWith(`${root}/package.json`, 'version', version);
		expect(output.success).toBe(true);
	});
});
