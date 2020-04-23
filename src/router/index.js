import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'

Vue.use(VueRouter)


const router = new VueRouter({
  routes : [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})

// 如果用戶沒有登錄，但是直接通過URL訪問特定頁面，需要重新導航到登錄頁面
// 掛載路由導航守衛
router.beforeEach((to, from, next) => {
  // 如果用戶訪問的登錄頁，則直接放行
  if (to.path === '/login') return next()
  // 從 sessionStorage 中獲取到保存的 token 值
  const tokenStr = sessionStorage.getItem('token')
  // 如果沒有token，則強制跳轉到登錄頁
  if (!tokenStr) return next('/login')
  next()
})


export default router