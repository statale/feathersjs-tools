import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('nx-feathersjs e2e', () => {
  it('should create nx-feathersjs', async () => {
    const plugin = uniq('nx-feathersjs');
    ensureNxProject('@statale/nx-feathersjs', 'dist/packages/nx-feathersjs');
    await runNxCommandAsync(
      `generate @statale/nx-feathersjs:nx-feathersjs ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');
  }, 30000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('nx-feathersjs');
      ensureNxProject('@statale/nx-feathersjs', 'dist/packages/nx-feathersjs');
      await runNxCommandAsync(
        `generate @statale/nx-feathersjs:nx-feathersjs ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
    }, 30000);
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async () => {
      const plugin = uniq('nx-feathersjs');
      ensureNxProject('@statale/nx-feathersjs', 'dist/packages/nx-feathersjs');
      await runNxCommandAsync(
        `generate @statale/nx-feathersjs:nx-feathersjs ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
    }, 30000);
  });
});
