import request from '@/utils/request'

// Get grouping tree (completed)
export function getGroupTree(params) {
  return request({
    url: '/api/group/tree',
    method: 'get',
    params
  })
}
// Grouping list (completed)
export function groupList(params) {
  return request({
    url: '/api/group/list',
    method: 'get',
    params
  })
}
//Add grouping (completed)
export function groupAdd(data) {
  return request({
    url: '/api/group/add',
    method: 'post',
    data
  })
}
// Update grouping (completed)
export function groupUpdate(data) {
  return request({
    url: '/api/group/update',
    method: 'post',
    data
  })
}
// Delete grouping (completed)
export function groupDel(data) {
  return request({
    url: '/api/group/delete',
    method: 'post',
    data
  })
}
// Users within a group (completed)
export function useGroupList(params) {
  return request({
    url: '/api/group/useringroup',
    method: 'get',
    params
  })
}
// Users no longer grouped (completed)
export function useGroupRole(params) {
  return request({
    url: '/api/group/usernoingroup',
    method: 'get',
    params
  })
}
// Add user to group (completed)
export function groupInfo(data) {
  return request({
    url: '/api/group/adduser',
    method: 'post',
    data
  })
}
// Move the user out of the group (completed)
export function delGroup(data) {
  return request({
    url: '/api/group/removeuser',
    method: 'post',
    data
  })
}
// Synchronize DingTalk Department Information
export function syncDingTalkDeptsApi(data) {
  return request({
    url: '/api/group/syncDingTalkDepts',
    method: 'post',
    data
  })
}

// Synchronize corporate WeChat department information
export function syncWeComDeptsApi(data) {
  return request({
    url: '/api/group/syncWeComDepts',
    method: 'post',
    data
  })
}

// Synchronous information on Feishu Department
export function syncFeiShuDeptsApi(data) {
  return request({
    url: '/api/group/syncFeiShuDepts',
    method: 'post',
    data
  })
}

// Synchronize openldap department information
export function syncOpenLdapDeptsApi(data) {
  return request({
    url: '/api/group/syncOpenLdapDepts',
    method: 'post',
    data
  })
}
// Synchronize the grouping of the database to ldap
export function syncSqlGroups(data) {
  return request({
    url: '/api/group/syncSqlGroups',
    method: 'post',
    data
  })
}