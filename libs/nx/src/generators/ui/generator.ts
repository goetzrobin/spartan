import { GeneratorCallback, runTasksInSerial, Tree } from '@nx/devkit';
import { HlmUIGeneratorSchema } from './schema';
import { prompt } from 'enquirer';
import { HlmBaseGeneratorSchema } from '../base/schema';

export async function hlmUIGenerator(tree: Tree, options: HlmUIGeneratorSchema) {
  const availablePrimitives = await import('./supported-ui-libraries.json');
  const availablePrimitiveNames = Object.keys(availablePrimitives);
  const response: { primitives: string[] } = await prompt({
    type: 'multiselect',
    required: true,
    name: 'primitives',
    message: 'Choose which library you want to copy',
    choices: ['all', ...availablePrimitiveNames],
  });
  const primitivesToCreate = response.primitives.includes('all') ? availablePrimitiveNames : response.primitives;
  const tasks: GeneratorCallback[] = [];
  for (const primitiveName of primitivesToCreate) {
    const internalName = availablePrimitives[primitiveName]['internalName'];
    const peerDependencies = availablePrimitives[primitiveName]['peerDependencies'];
    const installTask = await (
      (await import(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        `./libs/${internalName}/generator`
      )) as {
        generator: (tree: Tree, options: HlmBaseGeneratorSchema) => Promise<GeneratorCallback>;
      }
    ).generator(tree, {
      // get overwritten by each specific generator
      internalName: '',
      publicName: '',
      primitiveName: '',
      peerDependencies,
      skipBrainDependencies: options.skipBrainDependencies,
      directory: options.directory,
      tags: options.tags,
      rootProject: options.rootProject,
    });
    tasks.push(installTask);
  }
  return runTasksInSerial(...tasks);
}

export default hlmUIGenerator;
