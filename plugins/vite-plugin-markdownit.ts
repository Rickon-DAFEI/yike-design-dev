import MarkdownIt from 'markdown-it';
import MarkdownItContainer from 'markdown-it-container';
import hljs from 'highlight.js';
import { compileTemplate, parse } from '@vue/compiler-sfc';
import compiler from '@vue/compiler-dom';
import { resolveComponent } from 'vue';

export function pad(source) {
  return source
    .split(/\r?\n/)
    .map(line => `  ${line}`)
    .join('\n');
}

export function genInlineComponentText(template, script) {
  const finalOptions: any = {
    source: `<div>${template}</div>`,
    filename: 'inline-component',
    id: 'inline-component',
    compiler,
  };
  const compiled = compileTemplate(finalOptions);
  // tips
  if (compiled.tips && compiled.tips.length) {
    compiled.tips.forEach(tip => {
      console.warn(tip);
    });
  }
  // errors
  if (compiled.errors && compiled.errors.length) {
    console.error(
      `\n  Error compiling template:\n${pad(compiled.source)}\n${compiled.errors
        .map(e => `  - ${e}`)
        .join('\n')}\n`,
    );
  }
  let demoComponentContent = `
      ${compiled.code}
    `;
  const vueIndex = demoComponentContent.indexOf('vue');
  demoComponentContent = demoComponentContent.slice(vueIndex + 4);
  demoComponentContent = demoComponentContent.replace(/export/, '');
  let scriptTrim = script?.trim();
  if (script) {
    // TODO: 兼容vue3 setup 与vue3 defineComponent
    scriptTrim = scriptTrim.replace(
      /export\s+default/,
      'const exportJavaScript =',
    );
  } else {
    scriptTrim = 'const exportJavaScript = {}';
  }
  demoComponentContent = `(function() {
      ${demoComponentContent}
      ${scriptTrim}
      return {
        render,
        ...exportJavaScript,
      }
    })()`;

  return demoComponentContent;
}

export default () => ({
  name: 'vitePluginMarkdown',
  transform(src, id) {
    if (id.endsWith('.md')) {
      // 需要解析成vue代码块集合
      const componentCodeList = [];
      const styleCodeList = [];
      const globalScript = [];
      // 初始还MarkdownIt用于转换md文件为html
      const markdownIt = MarkdownIt({
        html: true,
        xhtmlOut: true,
        // 将markdown中的代码块用hljs高亮显示
        highlight(str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value
              }</code></pre>`;
          }
          return `<pre class="hljs"><code>${markdownIt.utils.escapeHtml(
            str,
          )}</code></pre>`;
        },
      });
      // 解析【:::tip:::】
      markdownIt.use(MarkdownItContainer, 'tip');
      // 解析【:::warning:::】
      markdownIt.use(MarkdownItContainer, 'warning');
      // 使用【markdown-it-container】插件解析【:::snippet :::】代码块为vue渲染
      markdownIt.use(MarkdownItContainer, 'snippet', {
        // 验证代码块为【:::snippet :::】才进行渲染
        validate(params) {
          return params.trim().match(/^snippet\s*(.*)$/);
        },
        // 代码块渲染
        render(tokens, index) {
          const token = tokens[index];
          const tokenInfo = token.info.trim().match(/^snippet\s*(.*)$/);
          if (token.nesting === 1) {
            // 获取snippet第一行的表述内容
            const desc = tokenInfo && tokenInfo.length > 1 ? tokenInfo[1] : '';
            // 获取vue组件示例的代码
            const nextIndex = tokens[index + 1];
            const contentFence =
              nextIndex.type === 'fence' ? nextIndex?.content : '';
            // 将content解析为vue组件基本属性对象;
            const { descriptor } = parse(contentFence);
            const { template, script, styles } = descriptor;
            styleCodeList.push(styles);

            // 将template的转为render函数
            const templateCodeRender = genInlineComponentText(
              template?.content,
              script?.content,
            );
            if (script) {
              const [global] = script.content.split(/export\s+default/);
              globalScript.push(global.trim());
            }

            // 代码块解析将需要解析vue组件的存储，渲染html用组件名称替代
            const name = `yk-snippent-${componentCodeList.length}`;
            componentCodeList.push(`"${name}":${templateCodeRender}`);
            // 代码块解析将需要解析vue组件的存储，渲染html用组件名称替代
            return `<Snippet>
                      <template v-slot:desc>${markdownIt.render(
              desc,
            )}</template>
                      <template v-slot:source>
                        <${name} />
                      </template>
                      <template v-slot:code>`;
          }
          return `    </template>
                    </Snippet> `;
        },
      });
      // 将所有转换好的代码字符串拼接成vue单组件template、script、style格式
      const code = `
      import {
        createTextVNode as _createTextVNode,
        resolveComponent as _resolveComponent,
        withCtx as _withCtx,
        createVNode as _createVNode,
        openBlock as _openBlock,
        createBlock as _createBlock,
        toDisplayString as _toDisplayString ,
        createElementBlock as  _createElementBlock,
        createElementVNode as _createElementVNode,
        normalizeStyle as _normalizeStyle 
      } from "vue"
      ${globalScript.join(' ')}

      <template>
        <div class="yk-snippet-doc">
          ${markdownIt.render(src)}
        </div>
      </template>
      <script>
        export default {
        name: 'yk-component-doc',
        components: {
          ${componentCodeList.join(',')}
        }
      }
     </script>
      <style lang='less'>
        ${Array.from(styleCodeList, m => m.content).join('\n')}
      </style>`;

      return {
        code,
        map: null,
      };
    }
  },
});
