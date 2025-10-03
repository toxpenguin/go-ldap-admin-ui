import request from '@/utils/request'
// User login (completed)
export function login(data) {
  return request({
    url: '/api/base/login',
    method: 'post',
    data
  })
}

export function refreshToken() {
  return request({
    url: '/api/base/refreshToken',
    method: 'post'
  })
}
// User exit interface (completed)
export function logout() {
  return request({
    url: '/api/base/logout',
    method: 'post'
  })
}
