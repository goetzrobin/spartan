import type { ExecutorContext } from '@nx/devkit';
import * as process from 'process';
import { replace } from 'replace-json-property';

import { getRoot } from '../helpers/projects.helpers';

import type { ReplaceVersionExecutorSchema } from './schema';

export default async function runExecutor(options: ReplaceVersionExecutorSchema, context: ExecutorContext) {
	const sourceRoot = getRoot(context);
	replace(`${sourceRoot}/package.json`, 'version', process.env.VERSION);
	return {
		success: true,
	};
}
