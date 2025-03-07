import App from './App'
// import { debuggerModule } from 'uni_modules/imengyu-IMDebuggerWindow/common/debuggerExtern.js'


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
// const errorHandler = (err, vm, info) => { 
//   if(debuggerModule) debuggerModule.addVueError(err, vm, info);
// }


export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.R = R
  // app.config.errorHandler = errorHandler;  
  app.mixin(ZPagingMixin)
  return {
    app
  }
}
// #endif