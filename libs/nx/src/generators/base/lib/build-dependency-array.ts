import { HlmBaseGeneratorSchema } from '../schema';
import {
  SPARTAN_ACCORDION_BRAIN_VERSION,
  SPARTAN_ALERT_DIALOG_BRAIN_VERSION,
  SPARTAN_AVATAR_BRAIN_VERSION,
  SPARTAN_COMMAND_BRAIN_VERSION,
  SPARTAN_CORE_VERSION,
  SPARTAN_DIALOG_BRAIN_VERSION,
  SPARTAN_MENU_BRAIN_VERSION,
  SPARTAN_POPOVER_BRAIN_VERSION,
  SPARTAN_PROGRESS_BRAIN_VERSION,
  SPARTAN_RADIO_GROUP_BRAIN_VERSION,
  SPARTAN_SEPARATOR_BRAIN_VERSION,
  SPARTAN_SHEET_BRAIN_VERSION,
  SPARTAN_SWITCH_VERSION,
  SPARTAN_TABS_VERSION,
  SPARTAN_TOGGLE_VERSION,
} from '../versions';

const BRAIN_DEPENDENCY_MAP = {
  accordion: SPARTAN_ACCORDION_BRAIN_VERSION,
  alertdialog: SPARTAN_ALERT_DIALOG_BRAIN_VERSION,
  avatar: SPARTAN_AVATAR_BRAIN_VERSION,
  command: SPARTAN_COMMAND_BRAIN_VERSION,
  dialog: SPARTAN_DIALOG_BRAIN_VERSION,
  menu: SPARTAN_MENU_BRAIN_VERSION,
  popover: SPARTAN_POPOVER_BRAIN_VERSION,
  progress: SPARTAN_PROGRESS_BRAIN_VERSION,
  radiogroup: SPARTAN_RADIO_GROUP_BRAIN_VERSION,
  separator: SPARTAN_SEPARATOR_BRAIN_VERSION,
  sheet: SPARTAN_SHEET_BRAIN_VERSION,
  switch: SPARTAN_SWITCH_VERSION,
  tabs: SPARTAN_TABS_VERSION,
  toggle: SPARTAN_TOGGLE_VERSION,
};

export function buildDependencyArray(options: HlmBaseGeneratorSchema) {
  let dependencies = {
    '@spartan-ng/ui-core': SPARTAN_CORE_VERSION,
  };
  if (options.additionalDependencies) {
    dependencies = { ...dependencies, ...options.additionalDependencies };
  }
  if (!options.skipBrainDependencies) {
    const brainDependency = BRAIN_DEPENDENCY_MAP[options.primitiveName];
    if (brainDependency) {
      dependencies = { ...dependencies, ['@spartan-ng/ui-' + options.primitiveName + '-brain']: brainDependency };
    }
  }
  return dependencies;
}
