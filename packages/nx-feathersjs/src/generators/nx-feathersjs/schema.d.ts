export interface NxFeathersjsGeneratorSchema {
  name: string;
  tags?: string;
  directory?: string;
  skipFormat?: boolean;
  unitTestRunner?: 'jest' | 'none';
}
