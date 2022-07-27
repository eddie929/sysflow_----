import request from '@/utils/request'
// 2021-10-26之后流程相关接口，主要用于流程处理完成等

// 查询系统流程数据表
export function get_flowInfo(params) {
  return request({
    url: '/flowgeneral/get_flowInfo',
    method: 'get',
    params
  })
}

// 查询已绑定数据表的流程
export function get_flowinfodata(params) {
  return request({
    url: '/flowgeneral/get_flowinfodata',
    method: 'get',
    params
  })
}

// 删除流程配置数据表数据
export function del_flowInfo(params) {
  return request({
    url: '/flowgeneral/del_flowInfo',
    method: 'delete',
    params
  })
}

// 插入通用处理，审批流程
export function insert_handling(data, nexthandler, fk_initiator, fk_flowinfo) {
  return request({
    url: '/flowgeneral/insert_handling?nexthandler=' + nexthandler + '&fk_initiator=' + fk_initiator + '&fk_flowinfo=' + fk_flowinfo,
    method: 'PUT',
    data
  })
}

// 插入流程配置数据表
export function insert_flowInfo(data) {
  return request({
    url: '/flowgeneral/insert_flowInfo',
    method: 'PUT',
    data
  })
}

// 插入流程配置数据表
export function flowback(data, fk_initiator, fk_flowinfo) {
  return request({
    url: '/flowgeneral/flowback?fk_initiator=' + fk_initiator + '&fk_flowinfo=' + fk_flowinfo,
    method: 'PUT',
    data
  })
}

// 查询自己相关流程记录
export function get_myflow(params) {
  return request({
    url: '/flowgeneral/get_myflow',
    method: 'get',
    params
  })
}
