import { glob } from 'fast-glob';
import fs from 'fs-extra';
import { Plugin, build } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
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

async function buildComponent({ umd = false }) {
  await fs.emptyDir(resolvePath('es'));
  await fs.emptyDir(resolvePath('lib'));
  const entry = [
    ...glob
      .sync('**/*.{ts,vue}', {
        absolute: true,
        cwd: componentSrc,
      })
      .filter((file) => !file.includes('style')),
  ];
  await build({
    mode: 'production',
    build: {
      target: 'modules',
      outDir: 'es',
      emptyOutDir: false,
      minify: false,
      lib: {
        entry,
      },
      rollupOptions: {
        // input: ['src/components/index.ts', 'src/components/svg-icon/index.ts'],
        output: [
          {
            format: 'es',
            dir: resolvePath('es'),

            entryFileNames: '[name].js',
            preserveModules: true,
            preserveModulesRoot: 'components',
          },
          {
            format: 'commonjs',
            dir: resolvePath('lib'),

            entryFileNames: '[name].js',
            preserveModules: true,
            preserveModulesRoot: 'components',
          },
        ],
      },
      // 开启lib模式，但不使用下面配置
    },
    plugins: [
      vue(),
      vueJsx(),
      dts({
        tsconfigPath: resolvePath('./tsconfig.json'),
        outDir: [resolvePath('es'), resolvePath('lib')],
      }),
      virtualPlugin(),
    ],
  });

  if (umd) {
    await fs.emptyDir(path.resolve(process.cwd(), 'dist'));
    await build(genUmdConfig('component'));
    await build(genUmdConfig('icon'));
  }
}

export default buildComponent;

// const buildComponent = async (umd = false) => {
//   await fs.emptyDir(resolvePath('es'));
//   await fs.emptyDir(resolvePath('lib'));
//   const entry = [
//     ...glob
//       .sync('**/*.{ts,vue}', {
//         absolute: true,
//         cwd: componentSrc,
//       })
//       .filter((file) => !file.includes('style')),
//   ];

//   await build({
//     plugins: [
//       vue({
//         script: {
//           defineModel: true,
//         },
//       }),
//       vueJsx() as any,
//       dts({
//         tsconfigPath: resolvePath('./tsconfig.json'),
//         outDir: [resolvePath('es'), resolvePath('lib')],
//       }),
//       virtualPlugin(),
//     ],
//     build: {
//       target: 'modules',
//       outDir: 'es',
//       emptyOutDir: false,
//       minify: false,
//       lib: {
//         entry,
//       },
//       rollupOptions: {
//         external: ['vue', '@vueuse/core'],
//         treeshake: true,

//         output: [
//           {
//             format: 'es',
//             dir: resolvePath('es'),
//             entryFileNames: '[name].js',
//             preserveModules: true,
//             preserveModulesRoot: 'components',
//           },
//           {
//             format: 'commonjs',
//             dir: resolvePath('lib'),
//             entryFileNames: '[name].js',
//             preserveModules: true,
//             preserveModulesRoot: 'components',
//           },
//         ],
//       },
//     },
//   });

//   const s = resolvePath('src/components/svg-icon/icons.json');
//   const t = resolvePath('es/components/svg-icon/icons.json');
//   await fs.copy(s, t);

//   if (umd) {
//     await fs.emptyDir(resolvePath('dist'));
//     await build(genUmdConfig('component'));
//     await build(genUmdConfig('icon'));
//   }

//   console.log('build success');
// };

// export default buildComponent;
