# @statale/feathers-environment

A more low level alternative to [@feathersjs/configuration](https://docs.feathersjs.com/api/configuration.html)

## Installation

```
npm install --save @statale/feathers-environment 
```

## Documentation

```ts
import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import { environment } from '@statale/feathers-environment';

import { Application } from './declarations';

const app: Application = express(feathers());

// import config from anywhere or any config library
const config = {
    host: "localhost",
    port: 3030,
    mongodb: "mongodb://localhost:27017/myapp",
};

// Load app configuration
app.configure(environment({
    config,
}));

// access config properties using the app
console.log(app.get('host'));
console.log(app.get('port'));
console.log(app.get('mongodb'));
```

## Development

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test feathers-environment` to execute the unit tests via [Jest](https://jestjs.io).
