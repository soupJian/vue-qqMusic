import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局样式文件
import './common/stylus/index.styl'
// 使用axios
import axios from 'axios'
Vue.prototype.$http = axios
// lazyload
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  loading: require('./assets/logo.png')
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
