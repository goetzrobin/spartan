export interface HlmBaseGeneratorSchema {
  internalName: string;
  publicName: string;
  directory?: string;
  rootProject?: boolean;
  tags?: string;
  additionalDependencies?: Record<string, string>;
}
