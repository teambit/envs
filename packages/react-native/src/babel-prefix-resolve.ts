export function babelPrefixResolve(dep: string, prefixType?: string): string {
  return dep.startsWith('module:')
    ? dep.substring(7)
    : dep.startsWith('@babel/')
    ? dep
    : prefixType && !dep.startsWith(`babel-${prefixType}`)
    ? `babel-${prefixType}-${dep}`
    : dep;
}
