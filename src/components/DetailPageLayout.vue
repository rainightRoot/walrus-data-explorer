<template>
  <div class="detail-page">
    <div class="back-link">
      <router-link :to="backLink">
        <span class="back-arrow">←</span> {{ backText }}
      </router-link>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <div>{{ loadingText }}</div>
    </div>
    <div v-else-if="error" class="error">{{ errorText }}</div>
    <slot v-else></slot>
  </div>
</template>

<script>
export default {
  name: 'DetailPageLayout',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    backLink: {
      type: String,
      required: true
    },
    backText: {
      type: String,
      default: 'Back'
    },
    loadingText: {
      type: String,
      default: 'Loading...'
    },
    errorText: {
      type: String,
      default: 'Failed to load data'
    }
  }
}
</script>

<style scoped>
.detail-page {
  margin-bottom: 40px;
}
.back-link {
  margin-bottom: 20px;
}
.back-link a {
  display: inline-flex;
  align-items: center;
  color: var(--text-light);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  font-size: 0.9rem;
}
.back-link a:hover {
  color: var(--primary-color);
}
.back-arrow {
  margin-right: 5px;
  font-size: 1.2rem;
}
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--text-light);
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 15px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.error {
  padding: 40px;
  text-align: center;
  color: var(--danger-color);
}
</style> 