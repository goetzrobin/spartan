import * as nxDevKit from '@nx/devkit';

import { getProjectName, getRoot } from './projects.helpers';

describe('executor project helper', () => {
  it('should return the project name', () => {
    const projectName = 'foo';
    expect(getProjectName({ projectName } as any)).toBe(projectName);
  });

  it('should get the root of the project', () => {
    const expectedRoot = 'libs/foo';
    const context = {
      projectName: 'foo',
      projectsConfigurations: {
        projects: {
          foo: {
            root: expectedRoot,
          },
        },
      },
    } as any;

    expect(getRoot(context)).toBe(expectedRoot);
  });
});
