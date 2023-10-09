import { sideEffects, getComponentsByName, sideEffectsDev } from './utils';
// const compPaths: any = {};
// const content = fetchIndexContent();
// parseImportStatements(compPaths, content);
const isDev = process.env.NODE_ENV === 'development';
export function YikeDevResolver(compName: string) {
  const yikeSrcPath = '@yike-design/ui/src';

  if (compName.startsWith('Yk')) {
    const dir = sideEffectsDev(getComponentsByName(compName));
    return {
      name: compName,
      from: yikeSrcPath,
      sideEffects: dir,
    };
  }
  if (compName.startsWith('Icon')) {
    return {
      name: compName,
      from: `${yikeSrcPath}/components/svg-icon`,
    };
  }
}
export function YikeResolver(compName: string) {
  if (isDev) {
    return YikeDevResolver(compName);
  }
  const yikeSrcPath = '@yike-design/ui/es';

  if (compName.startsWith('Yk')) {
    return {
      name: compName,
      from: yikeSrcPath,
      sideEffects: sideEffects(getComponentsByName(compName)),
    };
  }
  if (compName.startsWith('Icon')) {
    return {
      name: compName,
      from: `${yikeSrcPath}/components/svg-icon`,
    };
  }
}

// To Do
// publish resolver package
// add auto import method ducument
