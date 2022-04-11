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
    path: '/feed',
    name: 'Feed',
    component: loadView("Feed"),
    redirect: 'feed_home',
    children: [
      { path: '', name: 'feed_home', component: loadView("Feed/Home") },
      { path: '/feed/read', name: 'feed_read', component: loadView("Feed/Read") },
      { path: '/feed/write', name: 'feed_write', component: loadView("Feed/Write") },
    ]
  },
  {
    path: '/sweetAlert',
    name: 'SweetAlertTest',
    component: loadView("SweetAlertTest")
  },
  {
    path: '/chart',
    name: 'chartTest',
    component: loadView("chartTest")
  },
]

const router = new VueRouter({
  routes
})

export default router
