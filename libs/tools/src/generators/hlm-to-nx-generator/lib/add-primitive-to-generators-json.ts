import { Tree } from '@nx/devkit';
import { updateJson } from 'nx/src/generators/utils/json';

export const addPrimitiveToGeneratorsJSON = (tree: Tree, generatorName: string, internalName: string) => {
  updateJson(tree, 'libs/nx/generators.json', (old) => ({
    ...old,
    generators: {
      ...old.generators,
      [generatorName]: {
        factory: `./src/generators/${internalName}/generator`,
        schema: `./src/generators/${internalName}/schema.json`,
        description: `${internalName} generator`,
      },
    },
  }));
};
