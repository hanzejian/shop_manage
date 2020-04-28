import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', name: 'Welcome', component: Welcome },
        { path: '/users', name: 'Users', component: Users },
        { path: '/rights', name: 'Rights', component: Rights },
        { path: '/roles', name: 'Roles', component: Roles },
        { path: '/categories', name: 'Cate', component: Cate },
        { path: '/params', name: 'Params', component: Params },
        { path: '/goods', name: 'GoodsList', component: GoodsList },
        { path: '/goods/add', name: 'Add', component: Add },
        { path: '/orders', name: 'Order', component: Order },
      ]
    },

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