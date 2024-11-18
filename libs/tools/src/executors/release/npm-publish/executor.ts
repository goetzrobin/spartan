import type { ExecutorContext } from '@nx/devkit';
import { execSync } from 'node:child_process';

import { getRoot } from '../helpers/projects.helpers';

import type { NpmPublishExecutorSchema } from './schema';

export default async function runExecutor(_options: NpmPublishExecutorSchema, context: ExecutorContext) {
	const sourceRoot = `./dist/${getRoot(context)}`;
	execSync(`cd ${sourceRoot} && npm publish${process.env['TAG'] ? ` --tag ${process.env['TAG']}` : ''}`);
	return {
		success: true,
	};
}
