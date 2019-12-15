import { merge } from 'lodash';
import { Compiler, CompilerContext, InitAPI, Logger } from '@bit/bit.envs.common.compiler-types';
import { Preset } from '@bit/bit.envs.common.preset';
import { TesterContext, TesterOutput } from './tester-types';
import { runTester } from './tester';

export class Jest implements Compiler<TesterContext, TesterOutput> {
  private _logger: InitAPI['getLogger'] | null = null;

  constructor(private preset: Preset = {}) {
    this.getDynamicPackageDependencies = this.getDynamicPackageDependencies.bind(this);
    this.getDynamicConfig = this.getDynamicConfig.bind(this);
    this.action = this.action.bind(this);
  }

  public init(ctx: { api: InitAPI }) {
    this._logger = ctx.api.getLogger;
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

  public async action(tc: TesterContext): Promise<TesterOutput> {
    console.log('action');
    const result: TesterOutput = await runTester(tc, this.preset);
    return result;
  }

  get logger(): Logger {
    return this._logger!();
  }
}
