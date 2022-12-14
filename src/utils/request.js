import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 30 * 1000
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${getToken()}`// 请求头上加入token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    const errMsg = res.msg || '请求失败'
    if (res.code === -1) {
      Message({
        message: errMsg,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(errMsg))
    } else if (res.code === -105) {
      MessageBox.confirm('您的登录状态已经失效，请重新登录', '登录失效', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else {
      return res
    }
  },
  error => {
    // console.log('reject', { error })
    let errMsg = error.message || error.msg || '请求失败'
    if (error.response && error.response.data) {
      errMsg = error.response.data.msg
    }
    Message({
      message: '请求失败',
      type: 'error',
      duration: 5 * 1000
    })
    // store.dispatch('user/resetToken').then(() => {
    //   location.reload()
    // })
    return Promise.reject(error)
  }
)

export default service
