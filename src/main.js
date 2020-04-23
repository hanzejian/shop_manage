import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 導入圖標樣式
import './assets/fonts/iconfont.css'
// 导入全局样式表
import '../src/assets/css/global.css'
// 引入axios
import axios from 'axios'
// 配置請求根路徑
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
