import { merge } from 'lodash';
import { compile } from './compile';
import { ActionReturnType, Compiler, CompilerContext, InitAPI, Logger } from '@bit/bit.envs.common.compiler-types';
import { Preset, presetStore } from './preset';

const CONFIG_NAME = 'tsconfig';

export class TypescriptCompiler implements Compiler {
  private _logger: Logger | undefined;
  private preset: Preset;

  constructor(preset = 'NONE') {
    this.preset = presetStore[preset] || presetStore.NONE;
    this.getDynamicPackageDependencies = this.getDynamicPackageDependencies.bind(this);
    this.getDynamicConfig = this.getDynamicConfig.bind(this);
    this.action = this.action.bind(this);
  }

  public init(ctx: { api: InitAPI }) {
    this._logger = ctx.api.getLogger();
    return {
      write: true
    };
  }

  public getDynamicPackageDependencies(ctx: CompilerContext, name?: string) {
    const deps = this.preset.getDynamicPackageDependencies ? this.preset.getDynamicPackageDependencies() : {};
    return deps;
  }
  public getDynamicConfig(ctx: CompilerContext) {
    const defaultConfig = {
      tsconfig: {},
      development: false,
      copyPolicy: {
        ignorePatterns: ['package.json', 'package-lock.json', 'tsconfig.json'],
        disable: false
      }
    };
    const presetConfig = this.preset.getDynamicConfig ? this.preset.getDynamicConfig() : {};
    const config = merge({}, defaultConfig, presetConfig, ctx.rawConfig);
    return config;
  }

  public async action(compilerContext: CompilerContext): Promise<ActionReturnType> {
    const compileResult = await compile(compilerContext, this.preset);
    return compileResult;
  }

  get logger(): Logger | undefined {
    return this._logger;
  }
}
