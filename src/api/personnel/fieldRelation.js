import request from '@/utils/request'

// Field dynamic relationship list (complete)
export function relationList(params) {
  return request({
    url: '/api/fieldrelation/list',
    method: 'get',
    params
  })
}
// Add dynamic field relationship (complete)
export function relationAdd(data) {
  return request({
    url: '/api/fieldrelation/add',
    method: 'post',
    data
  })
}
// Update field dynamic relationship (complete)
export function relationUp(data) {
  return request({
    url: '/api/fieldrelation/update',
    method: 'post',
    data
  })
}
// Delete dynamic relationships in fields (complete)
export function relationDel(data) {
  return request({
    url: '/api/fieldrelation/delete',
    method: 'post',
    data
  })
}

