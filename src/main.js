import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入全局样式
import './assets/fonts/iconfont.css'
// 导入全局样式表
import '../src/assets/css/global.css'

import TreeTable from 'vue-table-with-tree-grid'

// 引入axios
import axios from 'axios'
// 配置請求根路徑
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// 设置axios请求拦截器，让已登陆的用户的请求携带taken字符串
axios.interceptors.request.use(config => {
  // 在最后必须return config
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
