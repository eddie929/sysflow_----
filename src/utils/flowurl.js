// 发起流程获取跳转路径
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default {
  install(Vue, options) {
    Vue.prototype.flowInitOpen = (val, put) => {
      // 供应商测试流程
      if (val.流程名称 === '编制汇总' || val.流程名称 === '新建供应商') {
        put.push({
          name: 'addsupplier',
          params: {
            rows: val
          }
        })
      }
      if (val.流程名称 === '编制发起') {
        put.push({
          name: 'budgetInit',
          params: {
            rows: val
          }
        })
      }
      if (val.流程名称 === '测试') {
        put.push({
          name: 'path_Test',
          params: {
            rows: val
          }
        })
      }
      //   // 处室预算执行与分析
      //   if (val == 490) {
      //     put.push({
      //       path: '/UFlow_BudgetPerform',
      //       query: {
      //         flowid: val,
      //         dbid: dbid
      //       }
      //     })
      //   }
    }
  }
}
