// import { MessageBox } from 'element-ui'

import { loadConfig } from 'svgo'

// 创建状态通知
function insert_box(code, oktitle) {
  if (code === 100) {
    this.$notify({
      title: '成功',
      message: oktitle || '创建成功',
      type: 'success'
    })
  } else if (code === 101) {
    this.$notify({
      title: '警告',
      message: oktitle || '参数无效请重试。',
      type: 'warning'
    })
  } else if (code === 102) {
    this.$notify({
      title: '警告',
      message: oktitle || '参数为空请重试。',
      type: 'warning'
    })
  } else if (code === -1) {
    this.$notify.error({
      title: '错误',
      message: oktitle || 'API错误，请联系管理员。'
    })
  }
}

function del_box(code, oktitle) {
  if (code === 100) {
    this.$notify({
      title: '成功',
      message: oktitle || '删除成功',
      type: 'success'
    })
  } else if (code === 101) {
    this.$notify({
      title: '警告',
      message: oktitle || '参数无效请重试。',
      type: 'warning'
    })
  } else if (code === 102) {
    this.$notify({
      title: '警告',
      message: oktitle || '参数为空请重试。',
      type: 'warning'
    })
  } else if (code === -1) {
    this.$notify.error({
      title: '错误',
      message: oktitle || 'API错误，请联系管理员。'
    })
  } else if (code === 110) {
    this.$notify({
      title: '警告',
      message: oktitle || '请选择...',
      type: 'warning'
    })
  }
}

function alter_box(code, oktitle) {
  if (code === 100) {
    this.$notify({
      title: '成功',
      message: oktitle || '修改成功',
      type: 'success'
    })
  } else if (code === 101) {
    this.$notify({
      title: '警告',
      message: oktitle || '参数无效请重试。',
      type: 'warning'
    })
  } else if (code === 102) {
    this.$notify({
      title: '警告',
      message: oktitle || '参数为空请重试。',
      type: 'warning'
    })
  } else if (code === -1) {
    this.$notify.error({
      title: '错误',
      message: oktitle || 'API错误，请联系管理员。'
    })
  }
}

function get_box(code, oktitle) {
  if (code === 100) {
    this.$notify({
      title: '成功',
      message: oktitle || '查询成功',
      type: 'success'
    })
  } else if (code === 101) {
    this.$notify({
      title: '警告',
      message: oktitle || '参数无效请重试。',
      type: 'warning'
    })
  } else if (code === 102) {
    this.$notify({
      title: '警告',
      message: oktitle || '参数为空请重试。',
      type: 'warning'
    })
  } else if (code === -1) {
    this.$notify.error({
      title: '错误',
      message: oktitle || 'API错误，请联系管理员。'
    })
  }
}

/**
 *
 * @param {*} title 提示信息
 */
function warning_box(title, type) {
  this.$notify({
    title: type || '警告',
    message: title || '警告内容自定义，我是默认的',
    type: 'warning'
  })
}

function get_title(事项名称, 部门名称) {
  return 事项名称 + '-' + 部门名称 + '-' + this.getNowFormatDate()
}

function getNowFormatDate() {
  var date = new Date()
  var seperator1 = '-'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}

/**
 * 获取用户是否又权限发起流程
 * @param {*} arr 能发起的流程数组
 * @param {*} flowname 验证是否有能发起的流程名称
 * @returns 能发起的流程数组
 */
function whetherflowinit(arr, flowname) {
  const resarr = arr.filter((num) => {
    return num.length > 0
  })
  const newArr = []
  for (let index = 0; index < resarr.length; index++) {
    resarr[index].forEach((item, index, array) => {
      if (item.流程名称 === flowname) {
        newArr.push(item)
      }
    })
  }
  return newArr
}

function verify(val) {
  if (parseInt(val) === 1) { return true } else { return false }
}
/**
 *
 * @param {*} 数字
 * @returns 保留两位小数
 */
// 只能输入整数，小数，但是不能只输入小数点，也不能有两个小数点，只能保留两位小数
 function handleDoble(number) {
  try {
    if (number > 999999000) {
      this.$message({
        message: '输入钱数不得超过999999000万!',
        type: 'warning'
      })
      return number.slice(0, number.length - 1)
    }
    if (isNaN(number)) {
      return ''
    }
    // 先把非数字的都替换掉，除了数字和小数点
    number = number.replace(/[^\d.]/g, '')
    // 必须保证第一个为数字而不是小数点
    number = number.replace(/^\./g, '')
    // 保证只有出现一个小数点而没有多个小数点
    number = number.replace(/\.{2,}/g, '.')
    // 保证小数点只出现一次，而不能出现两次以上
    number = number.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    // 保证只能输入两个小数
    number = number.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    return number
  } catch (error) {
    console.log(error)
    return ''
  }
}

export default {
  install(Vue, opeions) {
    Vue.prototype.insert_box = insert_box
    Vue.prototype.del_box = del_box
    Vue.prototype.alter_box = alter_box
    Vue.prototype.get_box = get_box
    Vue.prototype.getNowFormatDate = getNowFormatDate
    Vue.prototype.get_title = get_title
    Vue.prototype.whetherflowinit = whetherflowinit
    Vue.prototype.warning_box = warning_box
    Vue.prototype.verify = verify
    Vue.prototype.handleDoble = handleDoble
  }
}
