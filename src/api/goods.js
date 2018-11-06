import request from '@/utils/request'
import qs		from 'qs'
//查询数据
export function fetchList(data) {
	return request({
    url: '/goods/fetchList',
    method: 'post',
    data:qs.stringify(data)
  })
}
//新增商品
export function createData(data){
  return request({
    url: '/goods/createData',
    method: 'post',
    data:qs.stringify(data)
  })
}
//删除商品
export function deleteData(params){
  return request({
    url: '/goods/deleteData',
    method: 'get',
    params
  })
}
//更新商品
export function updateData(data){
  return request({
    url: '/goods/updateData',
    method: 'post',
    data:qs.stringify(data)
  })
}
//商品信息
export function goodsMsg(params){
  return request({
    url: '/goods/goodsMsg',
    method: 'get',
    params
  })
}
//商品详情
export function goodsInfo(params){
  return request({
    url: '/goods/goodsInfo',
    method: 'get',
    params
  })
}
//模糊搜索
export function grabbleData(params){
	return request({
    url: '/goods/grabbleData',
    method: 'get',
    params
  })
}
//类目列表
export function classList(){
  return request({
    url: '/category/classList',
    method: 'get',
  })
}
//品牌列表
export function brandList(){
  return request({
    url: '/brands/brandList',
    method: 'get',
  })
}
//商品评论列表
export function goodsComment(data){
  return request({
    url: '/comments/goodsComment',
    method: 'post',
    data:qs.stringify(data)
  })
}
//商品评论列表
export function grabbleComment(data){
  return request({
    url: '/comments/grabbleData',
    method: 'post',
    data:qs.stringify(data)
  })
}
//删除评论
export function deleteComment(data){
  return request({
    url: '/comments/deleteComment',
    method: 'post',
    data:qs.stringify(data)
  })
}