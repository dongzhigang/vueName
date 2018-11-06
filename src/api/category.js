import request from '@/utils/request'
import qs		from 'qs'
//类目列表
export function classifyList(data) {
	return request({
    url: '/Category/classList',
    method: 'post',
    data:qs.stringify(data)
  })
}
//类目添加
export function createData(data) {
	return request({
    url: '/Category/createData',
    method: 'post',
    data:qs.stringify(data)
  })
}
//类目信息
export function categoryMsg(data) {
	return request({
    url: '/Category/categoryMsg',
    method: 'post',
    data:qs.stringify(data)
  })
}

//类目更新
export function updateData(data) {
  return request({
    url: '/Category/updateData',
    method: 'post',
    data:qs.stringify(data)
  })
}

//删除一级类目
export function deleteData(data) {
  return request({
    url: '/Category/deleteData',
    method: 'post',
    data:qs.stringify(data)
  })
}
//删除一级类目
export function twoDeleteData(data) {
  return request({
    url: '/Category/twoDeleteData',
    method: 'post',
    data:qs.stringify(data)
  })
}
//查找类目
export function grabbleData(data) {
  return request({
    url: '/Category/grabbleData',
    method: 'post',
    data:qs.stringify(data)
  })
}