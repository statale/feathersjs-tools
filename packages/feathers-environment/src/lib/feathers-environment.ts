
import { Application } from '@feathersjs/feathers';
// import { createDebug } from '@feathersjs/commons';

// const debug = createDebug('@statale/feathers-environment');

interface InitOptions {
 config: Record<string, unknown>
}

export const environment = ({config}: InitOptions) =>  {
  return (app?: Application) => {
    if (!app) {
      return config;
    }

    // debug(`Initializing environment with config`);

    Object.keys(config).forEach(name => {
      const value = config[name];
      // debug(`Setting ${name} configuration value to`, value);
      app.set(name, value);
    });

    return config;
  };
}