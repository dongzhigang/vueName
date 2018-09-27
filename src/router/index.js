import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/view/index/Index'
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/',
    component: Index,
    title:'首页',
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: _import('dashboard/Dashboard'),
         meta:{title: '首页',}
      }
    ]
  }
]

export const asyncRouterMap = [
  {
    path: 'user',
    component: Index,
    title: '用户管理',
    index:'2',
    children: [
      {
        path: '/user/user',
        name: 'User',
        component: _import('user/user'),
        index:'2-1',
        meta:{title: '会员管理',}
      },
      {
        path: '/user/address',
        name: 'Address',
        component: _import('user/address'),
        index:'2-2',
        meta:{title: '收货地址',}
      }
    ]
  }
]

export default new Router({
  routes:constantRouterMap.concat(asyncRouterMap)
})
