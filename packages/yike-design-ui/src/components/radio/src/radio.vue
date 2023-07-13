<template>
  <label :class="ykRadioClass" ref="radioRef">
    <div :class="`yk-radio-${type}`">
      <input
        :value="label"
        v-model="modelValue"
        class="radio-original"
        type="radio"
        @change="handleChange"
        :disabled="disabled"
      />
      <div class="ui-radio"></div>
      <slot></slot>
    </div>
  </label>
</template>
<script setup lang="ts">
import { RadioProps, radioGroupKey } from './radio'
import { ref, onMounted, computed, toRefs, inject } from 'vue'
import '../style'

defineOptions({
  name: 'YkRadio',
})

const radioRef = ref(null)

const checked = ref<boolean>(false)

const radioGroup = inject(radioGroupKey, undefined)

const isGroup = computed(() => !!radioGroup)

const ykRadioClass = computed(() => {
  return {
    'yk-radio': true,
    'yk-radio-disabled': disabled,
  }
})

const disabled = computed(() => {
  return props.disabled
})

const props = withDefaults(defineProps<RadioProps>(), {
  modelValue: '',
  size: 'l',
  name: '',
  defaultChecked: false,
  label: '',
  disabled: false,
  type: 'radio',
})
const { label, type, modelValue } = toRefs(props)

if (props.modelValue != null) {
}

const handleChange = (e) => {
  console.log('🚀 ~ file: radio.vue:67 ~ e:', e)
}
</script>
