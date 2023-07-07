/*
 * @Description: md文件转成html
 * @Author: bruce
 * @Date: 2022-01-18 10:35:24
 * @LastEditTime: 2022-02-07 11:36:41
 * @LastEditors: bruce
 * @Reference:
 */

// const MarkdownIt = require('markdown-it');
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
        render(tokens, index) {
          const token = tokens[index]
          const tokenInfo = token.info.trim().match(/^snippet\s*(.*)$/);
          if (token.nesting === 1) {
            const desc = tokenInfo && tokenInfo.length > 1 ? tokenInfo[1] : '';
            const nextIndex = tokens[index + 1];
            const contentFence =
              nextIndex.type === 'fence' ? nextIndex?.content : '';
            return `<template>
            <template>${markdownIt.render(
              desc,
            )}</template>
            <template>
              ${JSON.stringify(contentFence)}
            </template>
            </template>`
          }

        }
      });
      const descc = "`测试`文档"
      const replacedMd = `
      <script setup>
      import UploadSingleFile from './upload-single-file.vue'
      </script>
      <template>
        <Snippet>
          <template v-slot:desc>${markdownIt.render(
        descc,
      )}</template>
          <template v-slot:source>
            <UploadSingleFile/>
          </template>
          <template v-slot:code>
          <pre class="hljs"><code><span class="hljs-tag">&lt;<span class="hljs-name">template</span>&gt;</span>
          </code></pre>
          </template>
        </Snippet>
        </template>
        `

      return {
        code: replacedMd,
        map: null,
      };
    }
  },
});
