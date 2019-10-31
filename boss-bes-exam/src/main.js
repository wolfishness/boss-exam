// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//引入elemen-u控件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' 

import QRCode from 'qrcodejs2';

Vue.prototype.$qrCode = QRCode;

//引用axios，并设置基础URL为后端api地址
import axios from 'axios'
Vue.prototype.$ajax = axios;
axios.defaults.baseURL='http://localhost:8014/api'
//将API方法绑定到全局
Vue.prototype.$axios = axios
Vue.config.productionTip = false

//使用use命令后才起作用
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
