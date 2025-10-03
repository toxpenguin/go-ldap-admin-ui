import request from '@/utils/request'
// Get data from homepage (completed)
export function getDash() {
    return request({
      url: '/api/base/dashboard',
      method: 'get'
    })
  }
