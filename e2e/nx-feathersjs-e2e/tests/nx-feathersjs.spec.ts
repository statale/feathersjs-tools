import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
  tmpProjPath,
} from '@nrwl/nx-plugin/testing';
import * as kill from 'kill-port';
import { exec } from 'child_process';

const port = 3030

describe('nx-feathersjs e2e', () => {
  beforeEach(async () => {
    await kill(port);
  });

  it('should create nx-feathersjs', async () => {
    const plugin = uniq('nx-feathersjs');
    ensureNxProject('@statale/nx-feathersjs', 'dist/packages/nx-feathersjs');
    await runNxCommandAsync(
      `generate @statale/nx-feathersjs:app ${plugin}`
    );

    await runNxCommandAsync(`build ${plugin}`);
    checkFilesExist(`dist/apps/${plugin}/main.js`);

    const server = await exec(`node ./dist/apps/${plugin}/main.js`, {
      cwd: tmpProjPath(),
    });
    
    await new Promise((resolve) => {
      server.stdout.on('data', async (data) => {
        console.log(data.toString());
        expect(data.toString()).toContain(
          `Feathers application started on http://localhost:${port}`
        );

        resolve(null);
      });
    });

  }, 300000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('nx-feathersjs');
      ensureNxProject('@statale/nx-feathersjs', 'dist/packages/nx-feathersjs');
      await runNxCommandAsync(
        `generate @statale/nx-feathersjs:app ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`apps/subdir/${plugin}/src/main.ts`)
      ).not.toThrow();
      expect(() =>
        checkFilesExist(`apps/subdir/${plugin}/src/app/index.ts`)
      ).not.toThrow();
      expect(() =>
        checkFilesExist(`apps/subdir/${plugin}/src/environments/environment.ts`)
      ).not.toThrow();
    }, 300000);
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async () => {
      const plugin = uniq('nx-feathersjs');
      ensureNxProject('@statale/nx-feathersjs', 'dist/packages/nx-feathersjs');
      await runNxCommandAsync(
        `generate @statale/nx-feathersjs:app ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
    }, 300000);
  });
});
