<template>
  <div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onMounted,
  provide,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue'

import type { RadioGroupProps } from './radio'

import { radioGroupKey } from './radio'

defineOptions({
  name: 'YkRadioGroup',
})

const props = withDefaults(defineProps<RadioGroupProps>(), {
  name: '',
})

const name = computed(() => {
  return props.name
})

const handleChange = () => {}

provide(
  radioGroupKey,
  reactive({
    ...toRefs(props),
    handleChange,
    name,
  }),
)
</script>
