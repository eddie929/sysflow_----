import request from '@/utils/request'

// 查询流程类别,流程信息
export function get_flowinit() {
  return request({
    url: '/flowhandle/get_flowinit',
    method: 'get'
  })
}
// 查询流程绑定节点
export function get_flownode(params) {
  return request({
    url: '/flowhandle/get_flownode',
    method: 'get',
    params
  })
}
// 查询线上绑定的sql条件
export function get_linesqlwhere(params) {
  return request({
    url: '/flowhandle/get_linesqlwhere',
    method: 'get',
    params
  })
}

// 查询用户能发起的流程列表
export function get_userflowinit(params) {
  return request({
    url: '/flowhandle/get_userflowinit',
    method: 'get',
    params
  })
}

// 查询图标
export function get_icon() {
  return request({
    url: '/flowhandle/get_icon',
    method: 'get'
  })
}
// 创建节点
export function insert_node(data) {
  return request({
    url: '/flowhandle/insert_node',
    method: 'PUT',
    data
  })
}
// 修改节点
export function alter_flownode(data) {
  return request({
    url: '/flowhandle/alter_flownode',
    method: 'post',
    data
  })
}
// 删除节点
export function del_node(params) {
  return request({
    url: '/flowhandle/del_node',
    method: 'delete',
    params
  })
}
// 创建节点连线
export function insert_nodeline(data) {
  return request({
    url: '/flowhandle/insert_nodeline',
    method: 'PUT',
    data
  })
}
// 删除节点连线
export function del_nodeline(params) {
  return request({
    url: '/flowhandle/del_nodeline',
    method: 'DELETE',
    params
  })
}
// 修改连线
export function alter_nodeline(data) {
  return request({
    url: '/flowhandle/alter_nodeline',
    method: 'POST',
    data
  })
}
// 创建节点绑定
export function insert_nodebinding(data) {
  return request({
    url: '/flowhandle/insert_nodebinding',
    method: 'PUT',
    data
  })
}
// 修改节点绑定
export function alter_nodebinding(data) {
  return request({
    url: '/flowhandle/alter_nodebinding',
    method: 'POST',
    data
  })
}
// 修改节点绑定
export function insert_flowinfo(data) {
  return request({
    url: '/flowhandle/insert_flowinfo',
    method: 'PUT',
    data
  })
}

// 创建流程类别
export function insert_flowcategory(data) {
  return request({
    url: '/flowhandle/insert_flowcategory',
    method: 'PUT',
    data
  })
}

// 创建流程
export function insert_flow(data) {
  return request({
    url: '/flowhandle/insert_flow',
    method: 'PUT',
    data
  })
}
// 创建线上绑定的sql条件
export function insert_linesqlwhere(data) {
  return request({
    url: '/flowhandle/insert_linesqlwhere',
    method: 'PUT',
    data
  })
}

// 修改流程类别，流程 一级二级必须存在
export function alter_flow(data) {
  return request({
    url: '/flowhandle/alter_flow',
    method: 'POST',
    data
  })
}
// 删除流程类别/流程
export function del_flow(params) {
  return request({
    url: '/flowhandle/del_flow',
    method: 'delete',
    params
  })
}

// 删除节点绑定表
export function del_nodebinding(params) {
  return request({
    url: '/flowhandle/del_nodebinding',
    method: 'delete',
    params
  })
}

// 查询表内字段名称
export function get_tablecolumn(params) {
  return request({
    url: '/flowhandle/get_tablecolumn',
    method: 'get',
    params
  })
}
// 删除线上绑定的sql条件
export function del_linesqlwherebyid(params) {
  return request({
    url: '/flowhandle/del_linesqlwherebyid',
    method: 'DELETE',
    params
  })
}

// 查询当前用户待办业务
export function get_backlog(params) {
  return request({
    url: '/flowhandle/get_backlog',
    method: 'get',
    params
  })
}

// 查询流程主表信息
export function get_uflow(params) {
  return request({
    url: '/flowhandle/get_uflow',
    method: 'get',
    params
  })
}

// 查询流程处理记录表
export function get_flowhandling(params) {
  return request({
    url: '/flowhandle/get_flowhandling',
    method: 'get',
    params
  })
}
