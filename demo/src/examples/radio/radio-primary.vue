<template>
  <yk-radio v-model="radioValue"></yk-radio>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const radioValue = ref(0)
</script>
