export function babelPrefixResolve(dep: string, prefixType?: string): string {
  if (dep.startsWith('module:')) {
    dep = dep.substring(7);
    return dep;
  }
  if (dep.startsWith('@babel/')) {
    dep = dep;
  } else if (prefixType && !dep.startsWith(`babel-${prefixType}`)) {
    dep = `babel-${prefixType}-${dep}`;
  }
  return dep;
}
