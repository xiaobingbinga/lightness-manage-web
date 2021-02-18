import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import './assets/css/global.css'

// 导入相关JS对象模块
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import echarts from 'echarts'

// import axios from "axios";
import axios from './http'
import VueAxios from "vue-axios";

import ElementUI from 'element-ui';

// 使用插件的形式，装载UI组件
Vue.use(ElementUI);

Vue.use(VueAxios,axios)

// 使用原型的方式将图标对象绑定在Vue对象中
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false;

new Vue({
  // 路由器对象
  router,
  // 公共数据的状态管理对象
  store,
  // 渲染app组件
  render: h => h(App)
}).$mount('#app')
