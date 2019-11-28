import { merge } from 'lodash';
import { ActionReturnType, Compiler, CompilerContext, InitAPI, Logger } from '@bit/bit.envs.common.compiler-types';
import { Preset } from '@bit/bit.envs.common.preset';
import { TesterContext, TesterReturnType } from './tester-types';

export class Jest implements Compiler<TesterContext, TesterReturnType> {
  private _logger: Logger | undefined;

  constructor(private preset: Preset = {}) {
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
      'jest-config': {}
    };
    const presetConfig = this.preset.getDynamicConfig ? this.preset.getDynamicConfig() : {};
    const config = merge({}, defaultConfig, presetConfig, ctx.rawConfig);
    return config;
  }

  public async action(compilerContext: CompilerContext): Promise<TesterReturnType> {
    const result: TesterReturnType = [];
    return Promise.resolve(result);
  }

  get logger(): Logger | undefined {
    return this._logger;
  }
}
