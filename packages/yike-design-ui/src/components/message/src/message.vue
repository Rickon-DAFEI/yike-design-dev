<template>
  <transition name="down" @before-leave="close">
    <div class="yk-message" v-if="isShow" :style="Style">
      <div class="yk-m-i">
        <YkIcon :name="iconStatusMap[props.type]"></YkIcon>
        <span class="text">{{ message }}</span>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { MessageProps } from './message'
import { ref, onMounted, computed } from 'vue'
import '../style'
import { YkIcon } from '../../../index'
defineOptions({
  name: 'YkMessage',
})
const props = withDefaults(defineProps<MessageProps>(), {
  message: '',
  type: 'success',
  duration: 600,
  offset: 20,
  zIndex: 100,
  onDestroy: () => {},
})
const Style = computed(() => ({
  top: `${props.offset}px`,
  zIndex: props.zIndex,
}))
const iconStatusMap = {
  warning: 'icon-warning',
  error: 'icon-error',
  success: 'icon-success',
}
const isShow = ref(false)
function startTimer() {
  setTimeout(() => {
    close()
  }, props.duration)
}

function close() {
  isShow.value = false
}
onMounted(() => {
  startTimer()
  isShow.value = true
})
</script>
