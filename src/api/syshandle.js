import request from '@/utils/request'

// 查询全部部门
export function get_departmentall() {
    return request({
      url: '/syshandle/get_departmentall',
      method: 'get'
    })
  }
// 创建二级部门
export function insert_departmenttwo(data) {
    return request({
      url: '/syshandle/insert_departmenttwo',
      method: 'PUT',
      data
    })
  }
// 创建三级部门
export function insert_departmentthree(data) {
    return request({
      url: '/syshandle/insert_departmentthree',
      method: 'PUT',
      data
    })
  }
// 修改部门信息
export function up_department(data) {
    return request({
      url: '/syshandle/up_department',
      method: 'POST',
      data
    })
  }
// 删除部门
export function del_department(params) {
    return request({
      url: '/syshandle/del_department',
      method: 'delete',
      params
    })
  }

