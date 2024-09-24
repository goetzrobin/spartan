jest.mock('child_process', () => ({
	execSync: jest.fn(),
}));

jest.mock('../update-version/executor', () => ({
	default: jest.fn(),
}));

jest.mock('../npm-publish/executor', () => ({
	default: jest.fn(),
}));

import * as childProcess from 'node:child_process';
import * as projectHelper from '../helpers/projects.helpers';
import * as npmPublish from '../npm-publish/executor';
import * as updateVersion from '../update-version/executor';
import executor from './executor';

describe('BuildUpdatePublish Executor', () => {
	it('should call update-version executor and npm publish executor with the options and context', async () => {
		const libName = 'foo';
		const mockContext = { bar: 'bar' } as any;

		jest.spyOn(projectHelper, 'getProjectName').mockReturnValue(libName);

		const output = await executor({}, mockContext as any);

		expect(updateVersion.default).toHaveBeenCalledWith({}, mockContext);
		expect(npmPublish.default).toHaveBeenCalledWith({}, mockContext);
		expect(childProcess.execSync).toHaveBeenCalledWith(`nx build --project ${libName}`);
		expect(output.success).toBe(true);
	});
});
