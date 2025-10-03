import request from '@/utils/request'

// Get the operation log list (completed)
export function getOperationLogs(params) {
  return request({
    url: '/api/log/operation/list',
    method: 'get',
    params
  })
}

// Batch deletion operation log (completed)
export function batchDeleteOperationLogByIds(data) {
  return request({
    url: '/api/log/operation/delete',
    method: 'post',
    data
  })
}

export function CleanOperationLog() {
  return request({
    url: '/api/log/operation/clean',
    method: 'delete'
  })
}
