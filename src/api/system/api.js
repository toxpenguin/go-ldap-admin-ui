import request from '@/utils/request'

// Get the interface list (completed)
export function getApis(params) {
  return request({
    url: '/api/api/list',
    method: 'get',
    params
  })
}

// Get the interface tree (categorized by interface Category field) (completed）
export function getApiTree(params) {
  return request({
    url: '/api/api/tree',
    method: 'get',
    params
  })
}

// Create an interface (completed)
export function createApi(data) {
  return request({
    url: '/api/api/add',
    method: 'post',
    data
  })
}

// Update interface (completed)
export function updateApiById(data) {
  return request({
    url: '/api/api/update',
    method: 'post',
    data
  })
}

// Batch deletion interface (completed)
export function batchDeleteApiByIds(data) {
  return request({
    url: '/api/api/delete',
    method: 'post',
    data
  })
}
