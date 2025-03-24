import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/global.css'
import './assets/responsive-tables.css'
import * as formatters from './utils/formatters'

// 注册全局方法
Object.keys(formatters).forEach(key => {
  Vue.prototype[`$${key}`] = formatters[key]
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app') 