import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入全局样式
import './assets/fonts/iconfont.css'
// 导入全局样式表
import '../src/assets/css/global.css'

import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

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



// 引入时间格式化插件
import moment from 'moment'
// 定义全局过滤器
Vue.filter('dateFormat', (data, pattern = "YYYY-MM-DD HH:MM:SS") => {
  return moment(data).format(pattern)
}
)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
