import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/UserHandle/Login',
    method: 'post', // ES6 新写法 参数名跟变量名一致 直接写就可以
    params
  })
}

export function getInfo(token) {
  return request({
    url: '/UserHandle/get_userinfo',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
// 添加用户
export function insertuser(data) {
  return request({
    url: '/UserHandle/InsertUser',
    method: 'post',
    data
  })
}

// 获取全部职务
export function postUserPost() {
  return request({
    url: '/UserHandle/QueryUserPost',
    method: 'get'
  })
}
// 获取用户

export function GetUserList(data) {
  return request({
    url: '/UserHandle/UserListPaging',
    method: 'post',
    data
  })
}
// 请求表格数据
/**
 *
 * @param {
 * params.data 分页信息和查询条件等
 * } params
 */
export function NewGetUserList(params) {
  // console.log(params);
  return request({
    url: params.url,
    // 默认post
    method: params.method || 'post',
    // get请求的话使用 params:params.data（后端标记formbody） post使用data:params.data
    data: params.data || {}

  })
}

// 删除用户

export function DeleteUser(data) {
  return request({
    url: '/UserHandle/DeleteUserByIDArray',
    method: 'post',
    data
  })
}

// 修改用户
export function UpdataSYS_Users(data) {
  return request({
    url: '/UserHandle/UpdataSYS_Users',
    method: 'post',
    data
  })
}
