import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
                                  * If set to true, the item will not be displayed in the sidebar (default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
                                  * If set to true, the root menu will always be displayed

                                  * If alwaysShow is not set, when the item has multiple subroutines,

                                  * It will become nested mode otherwise the root menu will not be displayed
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb If noRedirect is set, it will not be redirected in breadcrumbs
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles) Control page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set) Names are displayed in the sidebar and breadcrumbs (recommended settings)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar The icon appears in the sidebar
    noCache: true                if set true, the page will no be cached(default is false) If set to true, the page will not be cached (default is false)
    affix: true                  If set true, the tag will affix in the tags-view If set to true, the tag will be pasted into the tag view
    breadcrumb: false            If set false, the item will hide in breadcrumb (default is true) If set to false, the item will be hidden in breadcrumb (default is true)
    activeMenu: '/example/list'  If set path, the sidebar will highlight the path you set If path is set, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
* Basic page without permission requirements 
* All roles are accessible
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      },
      
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
      path: '/changePass',
      name:'changePass',
      hidden: true,
      meta: { title: '忘记密码', icon: 'user', noCache: true },
      component: () => import('@/views/changePassword/index'),
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {

    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
      
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      },
    
    ]
  },
  {
    path: '/groupUser',
    component: Layout,
    redirect: '/groupUser/userList/index',
    hidden: true,
    children: [
      {
        path: '/userList',
        component: () => import('@/views/groupUser/userList/index'),
        name: 'userList',
        meta: { title: '分组成员', icon: 'user', noCache: true }
      }
    ]
  
  },

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
