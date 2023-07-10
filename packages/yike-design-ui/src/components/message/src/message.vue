<template>
  <transition name="down">
    <div class="yk-message" v-if="isShow">
      <div class="yk-m-i">
        <span class="text">{{ message }}</span>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { MessageProps } from './message'
import { ref, onMounted } from 'vue'
import '../style'
defineOptions({
  name: 'YkMessage',
})
const props = withDefaults(defineProps<MessageProps>(), {
  message: '',
  type: 'success',
})
const iconStatusMap = {
  warning: 'icon-warning',
  error: 'icon-error',
  success: 'icon-success',
}
const isShow = ref(false)

onMounted(() => {
  isShow.value = true
  setTimeout(() => {
    isShow.value = false
  }, 3000)
})
</script>
