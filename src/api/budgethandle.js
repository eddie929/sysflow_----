import request from '@/utils/request'

// 预算管理-编制发起
export function insert_budgetInit(data, nexthandler) {
  return request({
    url: '/budgethandle/insert_budgetInit?nexthandler=' + nexthandler,
    method: 'PUT',
    data
  })
}

// 预算管理-创建科目信息
export function insert_subjectInfo(data) {
  return request({
    url: '/budgethandle/insert_subjectInfo',
    method: 'PUT',
    data
  })
}

// 查询自己相关流程记录
export function get_allSubject() {
  return request({
    url: '/budgethandle/get_allSubject',
    method: 'get'

  })
}
// 查询申请科目
export function get_applySubject(params) {
  return request({
    url: '/budgethandle/get_applySubject',
    method: 'get',
    params

  })
}

// 查询申请科目汇总
export function get_gatherSubject(params) {
  return request({
    url: '/budgethandle/get_gatherSubject',
    method: 'get',
    params

  })
}

// 修改申请科目状态
export function alter_applySubject(params) {
  return request({
    url: '/budgethandle/alter_applySubject',
    method: 'post',
    params

  })
}
