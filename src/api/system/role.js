import request from '@/utils/request'

// Get the role list (completed)
export function getRoles(params) {
  return request({
    url: '/api/role/list',
    method: 'get',
    params
  })
}

// Create a role (completed)
export function createRole(data) {
  return request({
    url: '/api/role/add',
    method: 'post',
    data
  })
}

// Update role (completed)
export function updateRoleById(data) {
  return request({
    url: '/api/role/update',
    method: 'post',
    data
  })
}

// Get the permission menu for the role (completed)
export function getRoleMenusById(params) {
  return request({
    url: '/api/role/getmenulist',
    method: 'get',
    params
  })
}

// Update the role's permissions menu (completed)
export function updateRoleMenusById( data) {
  return request({
    url: '/api/role/updatemenus',
    method: 'post',
    data
  })
}

// Obtain the permission interface for the role (completed)
export function getRoleApisById(params) {
  return request({
    url: '/api/role/getapilist',
    method: 'get',
    params
  })
}

// Update the permission interface of the role (completed)
export function updateRoleApisById(data) {
  return request({
    url: '/api/role/updateapis',
    method: 'post',
    data
  })
}

// Batch delete roles (completed)
export function batchDeleteRoleByIds(data) {
  return request({
    url: '/api/role/delete',
    method: 'post',
    data
  })
}
