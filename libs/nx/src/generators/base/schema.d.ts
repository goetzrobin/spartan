export interface HlmBaseGeneratorSchema {
  primitiveName: string;
  internalName: string;
  publicName: string;
  directory?: string;
  rootProject?: boolean;
  tags?: string;
  additionalDependencies?: Record<string, string>;
  skipBrainDependencies?: boolean;
}
