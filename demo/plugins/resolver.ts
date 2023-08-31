import { ComponentResolver } from 'unplugin-vue-components/types';
import fs from 'fs';
// 需要分析的文件路径
const inputFile = `../packages/yike-design-ui/src/index.ts`;

// 解析文件内容
const fileContent = fs.readFileSync(inputFile, 'utf-8');

// 存储导入路径和组件名称的映射关系
const importPaths = {};

// 提取导入路径和组件名称
const extractImports = (content) => {
  const importRegex = /import\s+({[^}]+}|[^{}\n]+)\s+from\s+['"](.+)['"]/g;

  let match;
  while ((match = importRegex.exec(content))) {
    const [, imports, importPath] = match;
    if (imports.includes('{')) {
      // 处理解构语法导入方式：{ YkCheckbox, YkCheckboxGroup }
      imports
        .replace(/[{}]/g, '')
        .split(',')
        .map((importName) => importName.trim())
        .forEach((componentName) => {
          // 截取末段路径 ./components/upload -> upload
          importPaths[componentName] = importPath.split('/').pop();
        });
    } else {
      // 处理默认导入方式：YkCheckbox
      const componentName = imports.trim();
      // 截取末段路径 ./components/upload -> upload
      importPaths[componentName] = importPath.split('/').pop();
    }
  }
};

extractImports(fileContent);
console.log('🚀 ~ file: resolver.ts:41 ~ importPaths:', importPaths);
function sideEffects(from: string) {
  return `${from}/style/index`;
}

export const YikeDevResolver: ComponentResolver = (componentName) => {
  if (componentName.startsWith('Yk')) {
    return {
      name: componentName,
      from: '@yike-design/ui/es/components',
      // sideEffects: sideEffects(
      //   `@yike-design/ui/es/components/${importPaths[componentName]}`,
      // ),
    };
  }
  if (componentName.startsWith('Icon')) {
    return {
      name: componentName,
      from: '@yike-design/ui/es/components/svg-icon',
    };
  }
};
