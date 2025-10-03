import request from '@/utils/request'

// Get the current logged-in user information (completed)
export function getInfo() {
  return request({
    url: '/api/user/info',
    method: 'get'
  })
}

// Get the user list (completed)
export function getUsers(params) {
  return request({
    url: '/api/user/list',
    method: 'get',
    params
  })
}

// Update user login password (completed)
export function changePwd(data) {
  return request({
    url: '/api/user/changePwd',
    method: 'post',
    data
  })
}

// Create a user (completed)
export function createUser(data) {
  return request({
    url: '/api/user/add',
    method: 'post',
    data
  })
}

// Update user (completed)
export function updateUserById(data) {
  return request({
    url: '/api/user/update',
    method: 'post',
    data
  })
}
// Batch deletion records* (completed)
export function batchDeleteUserByIds(data) {
  return request({
    url: '/api/user/delete',
    method: 'post',
    data
  })
}

// Change user status (completed)
export function changeUserStatus(data) {
  return request({
    url: '/api/user/changeUserStatus',
    method: 'post',
    data
  })
}

// Synchronize DingTalk user information
export function syncDingTalkUsersApi(data) {
  return request({
    url: '/api/user/syncDingTalkUsers',
    method: 'post',
    data
  })
}

// Synchronize enterprise WeChat user information
export function syncWeComUsersApi(data) {
  return request({
    url: '/api/user/syncWeComUsers',
    method: 'post',
    data
  })
}

// Synchronize Feishu user information
export function syncFeiShuUsersApi(data) {
  return request({
    url: '/api/user/syncFeiShuUsers',
    method: 'post',
    data
  })
}

// Synchronize openldap user information
export function syncOpenLdapUsersApi(data) {
  return request({
    url: '/api/user/syncOpenLdapUsers',
    method: 'post',
    data
  })
}

// Synchronize users in Sql to ldap
export function syncSqlUsers(data) {
  return request({
    url: '/api/user/syncSqlUsers',
    method: 'post',
    data
  })
}
