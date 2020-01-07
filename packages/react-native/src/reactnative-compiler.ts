import { merge, has } from 'lodash';
import { compile } from './compile';
import { babelPrefixResolve } from './babelPrefixResolve';
import { getDependencieVersion, getPackageDependencies } from './getDependencieVersion';
import {
  ActionReturnType,
  Compiler,
  CompilerContext,
  InitAPI,
  Logger,
  GenericObject
} from '@bit/bit.envs.common.compiler-types';
import { Preset } from '@bit/bit.envs.common.preset';

export class ReactNativeCompiler implements Compiler {
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
    let deps = this.preset.getDynamicPackageDependencies ? this.preset.getDynamicPackageDependencies() : {};
    const packageDeps = getPackageDependencies(
      `${ctx.context.componentDir ? ctx.context.componentDir : ctx.context.workspaceDir}/package.json`
    );

    if (has(ctx, 'rawConfig.babelrc.plugins')) {
      const babelPlugins: GenericObject = {};
      ctx.rawConfig.babelrc.plugins.map((plugin: string) => {
        const dep = babelPrefixResolve(plugin, 'plugin');
        babelPlugins[dep] = getDependencieVersion(packageDeps, dep, 'plugin');
      });
      deps.devDependencies = merge(deps.devDependencies, babelPlugins);
    }

    if (has(ctx, 'rawConfig.babelrc.presets')) {
      const babelPresets: GenericObject = {};
      ctx.rawConfig.babelrc.presets.map((preset: string) => {
        const dep = babelPrefixResolve(preset, 'preset');
        babelPresets[dep] = getDependencieVersion(packageDeps, dep, 'preset');
      });
      deps.devDependencies = merge(deps.devDependencies, babelPresets);
    }

    return deps;
  }

  public getDynamicConfig(ctx: CompilerContext) {
    const defaultConfig = {
      babelrc: {},
      development: false,
      copyPolicy: {
        ignorePatterns: ['package.json', 'package-lock.json', '.babelrc', 'babel.config.js'],
        disable: false
      },
      useExperimentalCache: false
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
