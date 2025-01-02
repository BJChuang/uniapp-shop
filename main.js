import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import ZPagingMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin'
import {R} from '@/plugins/http.js' // 请求方式中间件
export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.R = R
  app.mixin(ZPagingMixin)
  return {
    app
  }
}
// #endif