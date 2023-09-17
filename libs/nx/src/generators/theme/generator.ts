import { ProjectConfiguration, Tree } from '@nx/devkit';
import { prompt } from 'enquirer';
import { addThemeToApplicationStyles } from './libs/add-theme-to-application-styles';
import { getProjectsAndNames } from '../../utils/get-project-names';
import { SupportedRadii, SupportedTheme, SupportedThemes } from './libs/supported-theme-generator-map';

export default async function addThemeToApplicationGenerator(tree: Tree) {
  const { projects, projectNames } = getProjectsAndNames(tree);

  const response: { app: string } = await prompt({
    type: 'select',
    required: true,
    name: 'app',
    message: 'Choose which application you want to add the theme to:',
    choices: projectNames,
  });
  const project: ProjectConfiguration | undefined = projects.get(response.app);

  if (!project) return;

  const themeOptions: {
    theme: SupportedTheme;
    radius: string;
    addCdkStyles: boolean;
    stylesEntryPoint?: string;
    prefix?: string;
  } = await prompt([
    {
      type: 'select',
      required: true,
      name: 'theme',
      message:
        'Choose which theme to apply. You can always re-run this generator and add a custom prefix to add other themes.',
      choices: SupportedThemes,
    },
    {
      type: 'select',
      required: true,
      name: 'radius',
      initial: 2,
      message: 'Which corner radius do you want to use with your theme:',
      choices: [...SupportedRadii],
    },
    {
      type: 'input',
      name: 'stylesEntryPoint',
      message:
        "Path to the styles entry point relative to the workspace root. If not provided the generator will do its best to find it and it will error if it can't.",
    },
    {
      type: 'input',
      name: 'prefix',
      message:
        "Prefix class name applied to your theme's style definitions: e.g., theme-rose, theme-zinc. Leave empty for global theme.",
    },
  ]);

  addThemeToApplicationStyles(
    tree,
    {
      project: project.name,
      radius: parseFloat(themeOptions.radius),
      theme: themeOptions.theme,
      addCdkStyles: themeOptions.addCdkStyles,
      stylesEntryPoint: themeOptions.stylesEntryPoint,
      prefix: themeOptions.prefix,
    },
    project
  );
}
