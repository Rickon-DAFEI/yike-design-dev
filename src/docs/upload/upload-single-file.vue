<template>
  <upload :accept="accept" :uploadUrl="uploadUrl" :multiple="multiple"></upload>
</template>
<script lang="ts" setup>
const accept = '*'
const uploadUrl = 'www.baidu.com'
const multiple = true
</script>
