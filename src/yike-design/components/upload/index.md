# Upload 文件上传

用于常规文件或图片文件的上传。

## 基础用法

:::snippet 其他类型 `多文件` 上传基本用法。

```html
<template>
  <upload
  :accept="accept"
  :uploadUrl="uploadUrl"
  :multiple="multiple"
></upload>
</template>
<script>
  export default {
    data() {
     return {
        accept:'image/*',
        uploadUrl: "www.yike.com",
        multiple:true,
      };
    }
  }
</script>
```

:::

:::snippet 其他类型 `单文件` 上传基本用法。

```html
<template>
  <upload
  :accept="accept"
  :uploadUrl="uploadUrl"
  :multiple="multiple"
></upload>
</template>
<script>
  export default {
    data() {
     return {
        accept:'*',
        uploadUrl: "www.yike.com",
        multiple:false,
      };
    }
  }
</script>
```

:::