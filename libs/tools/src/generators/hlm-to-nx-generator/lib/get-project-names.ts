import { getProjects, Tree } from '@nx/devkit';

export const getProjectsAndNames = (tree: Tree) => {
  const projectNames: string[] = [];
  const projects = getProjects(tree);

  projects.forEach((projectConfiguration, projectName) => {
    if (projectConfiguration.projectType === 'library' && projectName.includes('helm')) {
      projectNames.push(projectName);
    }
  });
  return { projects, projectNames };
};
