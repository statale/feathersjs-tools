import { environment } from './feathers-environment';

describe('feathersEnvironment', () => {
  it('should work', () => {
    const config = {test: 'blah'}
    const configureFunction = environment({config})
    expect(typeof configureFunction).toEqual('function');
  });
});
