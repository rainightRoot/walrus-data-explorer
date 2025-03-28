<template>
  <transition name="toast">
    <div v-if="visible" class="toast" :class="type">
      {{ message }}
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    message: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'error', 'info'].includes(value)
    }
  }
}
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.toast.success {
  background-color: #42b983;
}

.toast.error {
  background-color: #ff6b6b;
}

.toast.info {
  background-color: #2196f3;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Dark mode support */
[data-theme="dark"] .toast {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
</style> 