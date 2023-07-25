import { execSync } from 'child_process';
import { ExecutorContext } from '@nx/devkit';

import { getRoot } from '../helpers/projects.helpers';

import { NpmPublishExecutorSchema } from './schema';

export default async function runExecutor(options: NpmPublishExecutorSchema, context: ExecutorContext) {
  const sourceRoot = `./dist/${getRoot(context)}`;
  execSync(`cd ${sourceRoot} && npm publish${process.env.TAG ? ' --tag ' + process.env.TAG : ''}`);
  return {
    success: true,
  };
}
