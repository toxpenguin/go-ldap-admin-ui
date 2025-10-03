import request from '@/utils/request'

// Get menu tree (completed)
export function getMenuTree() {
  return request({
    url: '/api/menu/tree',
    method: 'get'
  })
}

// Get menu list
export function getMenus() {
  return request({
    url: '/api/menu/list',
    method: 'get'
  })
}

// Create menu (completed)
export function createMenu(data) {
  return request({
    url: '/api/menu/add',
    method: 'post',
    data
  })
}

// Update menu (completed)
export function updateMenuById(data) {
  return request({
    url: '/api/menu/update',
    method: 'post',
    data
  })
}

// Batch Delete Menu (Completed)
export function batchDeleteMenuByIds(data) {
  return request({
    url: '/api/menu/delete',
    method: 'post',
    data
  })
}

// Get a list of accessible menus for users
export function getUserMenusByUserId(Id) {
  return request({
    url: '/api/menu/access/list/' + Id,
    method: 'get'
  })
}

// Get the user's accessible menu tree
export function getUserMenuTreeByUserId(params) {
  return request({
    url: '/api/menu/access/tree',
    method: 'get',
    params
  })
}
