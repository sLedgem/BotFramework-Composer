// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import find from 'lodash/find';
import { ProjectTemplate } from '@bfc/shared';
import { UserIdentity, pluginLoader } from '@bfc/plugin-loader';

import log from '../../logger';
import { LocalDiskStorage } from '../storage/localDiskStorage';
import { LocationRef } from '../bot/interface';
import { Path } from '../../utility/path';
import { copyDir } from '../../utility/storage';
import StorageService from '../../services/storage';
import { IFileStorage } from '../storage/interface';

interface TemplateData {
  [key: string]: {
    name: string;
    description: string;
    order?: number;
    icon?: string;
  };
}

const runtimes: TemplateData = {
  CSharp: {
    name: 'CSharp Runtime',
    description: 'A Bot Framework runtime using the CSharp/dotnet version of the SDK',
  },
};

// set a default runtime template.
// when we have multiple runtimes this will be a parameter.
const DEFAULT_RUNTIME = 'CSharp';

export class AssetManager {
  public templateStorage: LocalDiskStorage;
  private runtimesPath: string;
  private runtimeTemplates: ProjectTemplate[] = [];

  constructor(_: string, runtimesPath: string) {
    this.runtimesPath = runtimesPath;
    this.templateStorage = new LocalDiskStorage();

    // initialize the list of runtimes.
    this.getProjectRuntime();
  }

  public async getProjectTemplates() {
    return pluginLoader.extensions.botTemplates;
  }

  public async getProjectRuntime() {
    const path = this.runtimesPath;
    const output: ProjectTemplate[] = [];

    if (await this.templateStorage.exists(path)) {
      const folders = await this.templateStorage.readDir(path);
      this.runtimeTemplates = [];
      for (const name of folders) {
        const absPath = Path.join(path, name);
        if ((await this.templateStorage.stat(absPath)).isDir) {
          const base = { id: name, name: runtimes[name].name, description: runtimes[name].description };
          this.runtimeTemplates.push({ ...base, path: absPath });
          output.push(base);
        }
      }
    }

    return output;
  }

  public async copyDataFilesTo(templateId: string, dstDir: string, dstStorage: IFileStorage) {
    const template = find(pluginLoader.extensions.botTemplates, { id: templateId });
    if (template === undefined || template.path === undefined) {
      throw new Error(`no such template with id ${templateId}`);
    }
    // copy Composer data files
    await copyDir(template.path, this.templateStorage, dstDir, dstStorage);
  }

  public async copyRuntimeTo(dstDir: string, dstStorage: IFileStorage) {
    const runtime = find(this.runtimeTemplates, { id: DEFAULT_RUNTIME });
    if (runtime === undefined || runtime.path === undefined) {
      throw new Error(`no such runtime with id ${DEFAULT_RUNTIME}`);
    }
    // copy runtime code files
    await copyDir(runtime.path, this.templateStorage, dstDir, dstStorage);
  }

  public async copyProjectTemplateTo(templateId: string, ref: LocationRef, user?: UserIdentity): Promise<LocationRef> {
    // user storage maybe diff from template storage
    const dstStorage = StorageService.getStorageClient(ref.storageId, user);
    const dstDir = Path.resolve(ref.path);
    if (await dstStorage.exists(dstDir)) {
      log('Failed copying template to %s', dstDir);
      throw new Error('already have this folder, please give another name');
    }
    await this.copyDataFilesTo(templateId, dstDir, dstStorage);
    // await this.copyRuntimeTo(dstDir, dstStorage);
    return ref;
  }
}
