import request from '@/utils/request'
import qs		from 'qs'
//查询数据
export function fetchList(data) {
	return request({
    url: '/Admins/fetchList',
    method: 'post',
    data:qs.stringify(data)
  })
}
//新增
export function createData(data) {
	return request({
    url: '/Admins/createData',
    method: 'post',
    data:qs.stringify(data)
  })
}
//更新
export function updateData(data) {
	return request({
    url: '/Admins/updateData',
    method: 'post',
    data:qs.stringify(data)
  })
}
//删除
export function deleteData(params) {
	return request({
    url: '/Admins/deleteData',
    method: 'get',
    params
  })
}
//详情
export function detailData(params) {
	return request({
    url: '/Admins/detailData',
    method: 'get',
    params
  })
}
//模糊搜索
export function grabbleData(params){
	return request({
    url: '/Admins/grabbleData',
    method: 'get',
    params
  })
}