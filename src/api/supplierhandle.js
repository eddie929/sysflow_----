import request from '@/utils/request'

// 创建供应商
export function insert_supplier(data, nexthandler) {
  return request({
    url: '/supplierhandle/insert_supplier?nexthandler=' + nexthandler,
    method: 'PUT',
    data
  })
}

export function insert_ssupplier(data) {
  return request({
    url: '/supplierhandle/insert_ssupplier',
    method: 'PUT',
    data
  })
}

export function get_sflowsupplier(params) {
  return request({
    url: '/supplierhandle/get_sflowsupplier',
    method: 'get',
    params
  })
}
