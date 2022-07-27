// 处理时间日期等
/**
 *
 * @returns 当前日期
 */
function get_nowDate() {
  var nowDate = ''
  var date = new Date()
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let dates = date.getDate()
  // if (month < 10) {
  //   month = "0" + (month + 1);
  // }
  month = month < 10 ? '0' + month : month
  if (dates < 10) {
    dates = '0' + dates
  }
  nowDate = year + '-' + month + '-' + dates
  return nowDate
}
export default {
  install(Vue, opeions) {
    Vue.prototype.get_nowDate = get_nowDate
  }
}
