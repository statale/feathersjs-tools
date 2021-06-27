import {
    addDependenciesToPackageJson,
    Tree,
    updateJson,
    formatFiles,
    convertNxGenerator,
  } from '@nrwl/devkit';
  
  import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';
  
  import { initGenerator as nodeInitGenerator } from '@nrwl/node';
  
  import { NxFeathersjsGeneratorSchema as Schema } from './schema';
  
  function removeNrwlExpressFromDeps(tree: Tree) {
    updateJson(tree, 'package.json', (json) => {
      delete json.dependencies['@statale/nx-feathersjs'];
      return json;
    });
  }
  
  export async function initGenerator(tree: Tree, schema: Schema) {
    setDefaultCollection(tree, '@statale/nx-feathersjs');
  
    const initTask = await nodeInitGenerator(tree, {
      unitTestRunner: schema.unitTestRunner,
      skipFormat: true,
    });
    removeNrwlExpressFromDeps(tree);
    const installTask = addDependenciesToPackageJson(
      tree,
      {
        '@feathersjs/express': 'latest', 
        '@feathersjs/feathers': 'latest', 
        '@feathersjs/socketio': 'latest', 
        '@statale/feathers-environment': 'latest',
        '@feathersjs/transport-commons': 'latest',
        '@feathersjs/errors' : 'latest',
        tslib: '^2.0.0',
        helmet: 'latest', 
        compression: 'latest', 
        cors: 'latest', 
        'body-parser': 'latest',
        winston: 'latest',  
      },
      {
        '@statale/nx-feathersjs': 'latest',
        '@types/body-parser': 'latest',
        "@types/compression": "^1.7.0",
        "@types/cors": "^2.8.10",
      }
    );
    if (!schema.skipFormat) {
      await formatFiles(tree);
    }
  
    return async () => {
      await initTask();
      await installTask();
    };
  }
  
  export default initGenerator;
  export const initSchematic = convertNxGenerator(initGenerator);