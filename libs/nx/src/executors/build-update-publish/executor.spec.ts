import * as childProcess from 'child_process';

import * as updateVersion from '../update-version/executor';
import * as projectHelper from '../helpers/projects.helpers';
import * as npmPublish from '../npm-publish/executor';

import executor from './executor';

describe('BuildUpdatePublish Executor', () => {
  it('should call update-version executor and npm publish executor with the options and context', async () => {
    const libName = 'foo';
    const mockContext = { bar: 'bar' } as any;

    /* eslint-disable */
    jest.spyOn(projectHelper, 'getProjectName').mockReturnValue(libName);
    /* eslint-disable */
    jest.spyOn(updateVersion, 'default').mockImplementation((() => {}) as any);
    /* eslint-disable */
    jest.spyOn(npmPublish, 'default').mockImplementation((() => {}) as any);
    /* eslint-disable */
    jest.spyOn(childProcess, 'execSync').mockImplementation((() => {}) as any);

    const output = await executor({}, mockContext as any);

    expect(updateVersion.default).toHaveBeenCalledWith({}, mockContext);
    expect(npmPublish.default).toHaveBeenCalledWith({}, mockContext);
    expect(childProcess.execSync).toHaveBeenCalledWith(`nx build --project ${libName}`);
    expect(output.success).toBe(true);
  });
});
