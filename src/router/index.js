import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 用來載入 view的函式
function loadView(view) {
  return () => import(`@/views/${view}.vue`);
}


const routes = [
  {
    path: '/',
    name: 'Home',
    component: loadView("Home"),
  },
  {
    path: '/about',
    name: 'About',
    component: loadView("About")
  },
  {
    path: '/sweetAlert',
    name: 'SweetAlertTest',
    component: loadView("SweetAlertTest")
  },
]

const router = new VueRouter({
  routes
})

export default router
