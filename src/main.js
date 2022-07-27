import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/element-variables.scss'
import './styles/common.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
// 全局组件
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import * as filters from './filters' // global filters
import dayjs from 'dayjs' // 获取时间
import flowurl from '@/utils/flowurl.js'
Vue.use(flowurl)
Vue.prototype.dayjs = dayjs // 可以全局使用dayjs
// 自定义全局方法
import global from '@/utils/global.js'
import datetotime from '@/utils/datetotime.js'
Vue.use(global)
Vue.use(datetotime)
import jsPlumb from 'jsplumb'
Vue.use(jsPlumb)
import '@/views/flow_node/components/ef/index.css'

import XLSX from 'xlsx'
import echarts from 'echarts'
// import common from './common/common'
// Vue.prototype.$common = common // 其中$common就是调用时所使用的方法
Vue.prototype.$echarts = echarts
Vue.use(XLSX)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
