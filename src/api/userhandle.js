import request from '@/utils/request'

// 查询用户
export function get_alluser(params) {
  return request({
    url: '/userHandle/get_alluser',
    method: 'post',
    params
  })
}
// 查询节点绑定用户
export function get_bindinguser(params) {
  return request({
    url: '/userHandle/get_bindinguser',
    method: 'post',
    params
  })
}
// 查询节点绑定角色
export function get_bindingrole(params) {
  return request({
    url: '/userHandle/get_bindingrole',
    method: 'post',
    params
  })
}

// 查询系统角色
export function get_userrole() {
  return request({
    url: '/userHandle/get_userrole',
    method: 'get'
  })
}
// 分页查询系统角色
export function get_paginguserrole(params) {
  return request({
    url: '/userHandle/get_paginguserrole',
    method: 'get',
    params
  })
}

// 创建用户
export function insert_user(data) {
  return request({
    url: '/userHandle/insert_user',
    method: 'put',
    data
  })
}
// 修改用户
export function up_sysuser(data) {
  return request({
    url: '/userHandle/up_sysuser',
    method: 'post',
    data
  })
}

// 修改个人信息
export function up_activeuser(params) {
  return request({
    url: '/userHandle/up_activeuser',
    method: 'post',
    params
  })
}

// 修改用户密码
export function alter_password(params) {
  return request({
    url: '/userHandle/alter_password',
    method: 'post',
    params
  })
}

// 根据用户id 返回用户详细信息
export function get_userinfobyid(params) {
  return request({
    url: '/userHandle/get_userinfobyid',
    method: 'post',
    params
  })
}
// 修改系统角色
export function up_userrole(data) {
  return request({
    url: '/userHandle/up_userrole',
    method: 'post',
    data
  })
}

// 删除用户
export function del_sysuser(data) {
  return request({
    url: '/userHandle/del_sysuser',
    method: 'delete', //
    data
  })
}

// 删除系统角色
export function del_userrole(params) {
  return request({
    url: '/userHandle/del_userrole',
    method: 'delete', //
    params
  })
}

// 绑定用户角色
export function insert_userbindingrole(data) {
  return request({
    url: '/userHandle/insert_userbindingrole',
    method: 'put',
    data
  })
}

// 删除用户绑定角色表
export function del_userbindingrole(params) {
  return request({
    url: '/userHandle/del_userbindingrole',
    method: 'delete',
    params
  })
}

// 创建用户
export function insert_userrole(data) {
  return request({
    url: '/userHandle/insert_userrole',
    method: 'put',
    data
  })
}
