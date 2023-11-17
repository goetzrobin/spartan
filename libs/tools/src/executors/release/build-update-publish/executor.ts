import { ExecutorContext } from '@nx/devkit';
import { execSync } from 'child_process';

import { getProjectName } from '../helpers/projects.helpers';
import npmPublish from '../npm-publish/executor';
import updateVersion from '../update-version/executor';

import { BuildUpdatePublishExecutorSchema } from './schema';

export default async function runExecutor(options: BuildUpdatePublishExecutorSchema, context: ExecutorContext) {
	await updateVersion({}, context);
	execSync(`nx build --project ${getProjectName(context)}`);
	await npmPublish({}, context);
	return {
		success: true,
	};
}
