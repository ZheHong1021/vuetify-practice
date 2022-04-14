import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
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


Vue.config.productionTip = false // true: 線上發布 / false: 測試
// Vue.config.devtools = false // false: 關閉devtool
Vue.prototype.$axios = axios


// 全域 mixins
Vue.mixin({
  methods: {
      // 解決四捨五入精密度所帶來的問題
      roundToTwo(num) {
          return +(Math.round(num + "e+2")  + "e-2");
      },

      computeWeight(length){
        return parseFloat(length) * 2 + (20 * 0.01) / 0.5  + 3
      },

      computeTotalFeed(obj){
        // 係數取得 (水質、飼料種類、蝦子品種)
        let water_index = 0
          switch(obj.water){
              case "非常差": feed_index = 2; break;
              case "差": feed_index = 3; break;
              case "正常": feed_index = 4; break;
              case "良好": feed_index = 5; break;
              case "非常良好": feed_index = 6; break;
          }
        let feed_index = 0
            switch(obj.feed){
                case "非常差": feed_index =  2; break;
                case "差": feed_index =  3; break;
                case "正常": feed_index =  4; break;
                case "良好": feed_index =  5; break;
            }
        let breed_index = 0
            switch(obj.breed){
                case "白蝦": breed_index = 2; break;
                case "草蝦": breed_index = 3; break;
                case "泰國蝦": breed_index = 4; break;
                case "明蝦": breed_index = 5; break;
            }

          return (obj.weight * 1.5 - 3) + ( obj.temp * 0.5 + water_index * 0.7 + feed_index * 0.3 + breed_index * 0.9)
      }
  }
})


new Vue({
  router,
  store,
  vuetify,
  axios,
  render: h => h(App)
}).$mount('#app')
