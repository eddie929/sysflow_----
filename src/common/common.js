import { MessageBox } from 'element-ui'
export default {
  // 公开
  install(Vue, options) {
    Vue.prototype.confirm = params => {
      MessageBox.confirm(params.content, params.tip || '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: params.type || 'warning',
        // roundButton:true,
        center: true
      })
        .then(() => {
          params.fn && params.fn('ok')
        })
        .catch(() => {
          params.fn && params.fn('cancel')
        })
    }
  },
  setname(name) {
    console.log(name)
  }
}
