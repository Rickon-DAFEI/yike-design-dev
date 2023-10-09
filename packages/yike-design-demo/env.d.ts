/// <reference types="vite/client" />

declare module '*.md' {
  import type { Component } from 'vue';
  const Component: Component;
  export default Component;
}

declare module '*.vue' {
  import type { Component } from 'vue';
  const Component: Component;
  export default Component;
}
declare module '@yike-design-ui/src/components/spinner/src/directive' {
  export const vLoading: Directive<LoadingElement, boolean>;
}

declare module '@yike-design-ui/src/components/svg-icon' {
  const Icon: any;
  export default Icon;
}

declare module '@yike-design-ui/src' {
  export const YkTitle: any; // 你可以根据实际情况更精确地定义类型
  export const YkMessage: any;
  export const YkNotification: any;
}
