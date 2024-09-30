import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';
import type { ExecutorContext } from '@nx/devkit';

import { getRoot } from '../helpers/projects.helpers';
import type { ReplaceVersionExecutorSchema } from './schema';

function replaceVersionInPackageJson(filePath: string, key: string, newValue: string) {
	try {
		// Read the file content
		const fileContent = fs.readFileSync(filePath, 'utf-8');
		const jsonContent = JSON.parse(fileContent);

		// Modify the JSON property
		jsonContent[key] = newValue;

		// Write the modified content back to the file
		fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2), 'utf-8');
	} catch (error) {
		console.error(`Failed to replace version in ${filePath}:`, error);
		throw error;
	}
}

export default async function runExecutor(_options: ReplaceVersionExecutorSchema, context: ExecutorContext) {
	const sourceRoot = getRoot(context);
	const packageJsonPath = path.join(sourceRoot, 'package.json');

	replaceVersionInPackageJson(packageJsonPath, 'version', process.env['VERSION'] || '');

	return {
		success: true,
	};
}
