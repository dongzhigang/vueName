import request from '@/utils/request'
import qs		from 'qs'
//品牌商列表
export function brandList(data) {
	return request({
    url: '/Brands/brandList',
    method: 'post',
    data:qs.stringify(data)
  })
}
//品牌商添加
export function createData(data) {
	return request({
    url: '/Brands/createData',
    method: 'post',
    data:qs.stringify(data)
  })
}
//品牌商信息
export function categoryMsg(data) {
	return request({
    url: '/Brands/categoryMsg',
    method: 'post',
    data:qs.stringify(data)
  })
}

//品牌商更新
export function updateData(data) {
  return request({
    url: '/Brands/updateData',
    method: 'post',
    data:qs.stringify(data)
  })
}

//删除品牌商
export function deleteData(data) {
  return request({
    url: '/Brands/deleteData',
    method: 'post',
    data:qs.stringify(data)
  })
}
//查找品牌商
export function grabbleData(data) {
  return request({
    url: '/Brands/grabbleData',
    method: 'post',
    data:qs.stringify(data)
  })
}