import request from '@/utils/request'
import qs		from 'qs'
//查询数据
export function fetchList(data) {
	return request({
    url: '/users/fetchList',
    method: 'post',
    data:qs.stringify(data)
  })
}
//新增
export function createData(data) {
	return request({
    url: '/users/createData',
    method: 'post',
    data:qs.stringify(data)
  })
}
//更新
export function updateData(data) {
	return request({
    url: '/users/updateData',
    method: 'post',
    data:qs.stringify(data)
  })
}
//删除
export function deleteData(params) {
	return request({
    url: '/users/deleteData',
    method: 'get',
    params
  })
}
//详情
export function detailData(params) {
	return request({
    url: '/users/detailData',
    method: 'get',
    params
  })
}
//模糊搜索
export function grabbleData(params){
	return request({
    url: '/users/grabbleData',
    method: 'get',
    params
  })
}