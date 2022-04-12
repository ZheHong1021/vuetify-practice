import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

/* SweetAlert */
import VueSweetalert2 from 'vue-sweetalert2';
// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';
Vue.use(VueSweetalert2);

// 【material-design-icon】
// npm install --save material-design-icons-iconfont
import 'material-design-icons-iconfont/dist/material-design-icons.css'


// 【VueFontawesome】
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText}
  from '@fortawesome/vue-fontawesome'

library.add(fas, far, fab)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)


Vue.config.productionTip = false


// 全域 mixins
Vue.mixin({
  methods: {
      // 解決四捨五入精密度所帶來的問題
      roundToTwo(num) {
          return +(Math.round(num + "e+2")  + "e-2");
      },
  }
})


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
