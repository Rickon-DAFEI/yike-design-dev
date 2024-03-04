import fs from 'fs-extra';
import { Plugin, build } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import dts from 'vite-plugin-dts';
import { genUmdConfig } from './umd.config';
import { resolvePath, componentSrc } from '../../utils/paths';

const EXPORT_HELPER_ID = 'plugin-vue:export-helper';
const helperCode = `
export default (sfc, props) => {
  for (const [key, val] of props) {
    sfc[key] = val
  }
  return sfc
}
`;

function virtualPlugin(): Plugin {
  return {
    name: 'vite:vue-export-helper',
    enforce: 'pre',
    resolveId(source: string) {
      if (source === EXPORT_HELPER_ID) {
        return `${EXPORT_HELPER_ID}.js`;
      }
      return null;
    },
    load(source) {
      if (source === `${EXPORT_HELPER_ID}.js`) {
        return helperCode;
      }
      return null;
    },
  };
}
function externalPlugin(): Plugin {
  return {
    name: 'vite:external-node_modules',
    enforce: 'pre',
    async resolveId(source: string, importer) {
      const result = await this.resolve(source, importer, {
        skipSelf: true,
        custom: { 'node-resolve': {} },
      });

      if (result && /node_modules/.test(result.id)) {
        return false;
      }

      return null;
    },
  };
}

const buildComponent = async (umd = false) => {
  await fs.emptyDir(resolvePath('es'));
  await fs.emptyDir(resolvePath('lib'));
  // const entry = [
  //   ...glob
  //     .sync('**/*.{ts,vue}', {
  //       absolute: true,
  //       cwd: componentSrc,
  //     })
  //     .filter((file) => !file.includes('style')),
  // ];

  await build({
    mode: 'production',
    build: {
      target: 'modules',
      outDir: 'es',
      emptyOutDir: false,
      minify: false,
      rollupOptions: {
        input: ['index.ts', 'components/svg-icon/index.ts'],
        output: [
          {
            format: 'es',
            dir: 'es',
            entryFileNames: '[name].js',
            preserveModules: true,
            preserveModulesRoot: componentSrc,
          },
          {
            format: 'commonjs',
            dir: 'lib',
            entryFileNames: '[name].js',
            preserveModules: true,
            preserveModulesRoot: componentSrc,
          },
        ],
      },
      lib: {
        entry: 'components/index.ts',
        formats: ['es', 'cjs'],
      },
    },
    plugins: [externalPlugin(), vue(), vueJsx(), virtualPlugin(), dts()],
  });

  const s = resolvePath('components/svg-icon/icons.json');
  const t = resolvePath('es/svg-icon/icons.json');
  // await fs.copy(s, t);

  if (umd) {
    await fs.emptyDir(resolvePath('dist'));
    await build(genUmdConfig('component'));
    await build(genUmdConfig('icon'));
  }

  console.log('build success');
};

export default buildComponent;
