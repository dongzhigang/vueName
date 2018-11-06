import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/view/index/Index'
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/',
    component: Index,
    redirect: 'dashboard',
    title:'首页',
    meta:{auth:true},
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: _import('dashboard/dashboard'),
         meta:{title: '首页',index:'1'}
      }
    ]
  },
  {
    path: '/login',
    component: _import('login/index'),
    title:'登录',
  }
]

export const asyncRouterMap = [
  {
    path: 'user',
    component: Index,
    redirect: 'noredirect',
    meta:{title: '用户管理',index:'2',auth:true},
    children: [
      {
        path: '/user/user',
        name: 'User',
        component: _import('user/user'),
        meta:{title: '会员管理',index:'2-1',}
      },
      {
        path: '/user/address',
        name: 'Address',
        component: _import('user/address'),
        meta:{title: '收货地址',index:'2-2',}
      },
      {
        path: '/user/collect',
        name: 'Collect',
        component: _import('user/collect'),
        meta:{title: '会员收藏',index:'2-3',}
      }
    ]
  },
  {
    path:'mall',
    component: Index,
    redirect: 'noredirect',
    meta:{title: '商场管理',index:'3',auth:true},
    children: [
      { 
        path: '/mall/brand',
        name: 'Brand',
        component: _import('mall/brand'),
        meta:{title: '品牌商',index:'3-1',} 
      },
      { 
        path: '/mall/category',
        name: 'Category',
        component: _import('mall/category'),
        meta:{title: '商品类目',index:'3-2',} 
      },
      { 
        path: '/mall/order',
        name: 'Order',
        component: _import('mall/order'),
        meta:{title: '订单管理',index:'3-3',} 
      },
      { 
        path: '/mall/goodsCar',
        name: 'GoodsCar',
        component: _import('mall/goodsCar'),
        meta:{title: '购物车管理',index:'3-4',} 
      }
    ]
  },
  {
    path: 'goods',
    component: Index,
    redirect: 'noredirect',
    meta:{title: '商品管理',index:'4',auth:true},
    children: [
      {
        path: '/goods/goodsList',
        name: 'GoodsList',
        component: _import('goods/goodsList'),
        meta:{title: '商品列表',index:'4-1',},
      },
      {
        path: '/goods/goodsCreate',
        name: 'GoodsCreate',
        component: _import('goods/goodsCreate'),
        meta:{title: '商品上架',index:'4-2',}
      },
      {
        path: '/goods/goodsUpdate',
        name: 'GoodsUpdate',
        component: _import('goods/goodsUpdate'),
        meta:{title: '商品编辑', },
        hidden: true,
      },
      {
        path: '/goods/goodsComment',
        name: 'GoodsComment',
        component: _import('goods/goodsComment'),
        meta:{title: '商品评论',index:'4-3', },
      }
    ]
  },
  {
    path:'promotion',
    component: Index,
    redirect: 'noredirect',
    meta:{title: '推广管理',index:'5',auth:true},
    children:[
      {
        path: '/promotion/advertis',
        name: 'Advertis',
        component: _import('promotion/advertis'),
        meta:{title: '广告列表',index:'5-1',} 
      }
    ]
  },
  {
    path:'system',
    component: Index,
    redirect: 'noredirect',
    meta:{title: '系统管理',index:'6',auth:true},
    children:[
      {
        path: '/system/admin',
        name: 'Admin',
        component: _import('system/admin'),
        meta:{title: '管理员',index:'6-1',} 
      }
    ]
  }
]

export default new Router({
  routes:constantRouterMap.concat(asyncRouterMap)
})
