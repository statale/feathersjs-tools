import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  convertNxGenerator,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { applicationGenerator as nodeApplicationGenerator } from '@nrwl/node';
import { NxFeathersjsGeneratorSchema } from './schema';
import { initGenerator } from './init';

interface NormalizedSchema extends NxFeathersjsGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  host: Tree,
  options: NxFeathersjsGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(host).appsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    host,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export async function applicationGenerator (
  host: Tree,
  options: NxFeathersjsGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(host, options);
  const initTask = await initGenerator(host, { ...normalizedOptions, skipFormat: true });
  const applicationTask = await nodeApplicationGenerator(host, {
    ...options,
    skipFormat: true,
  });
  addFiles(host, normalizedOptions);
  await formatFiles(host);

  return async () => {
    await initTask();
    await applicationTask();
  };
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
