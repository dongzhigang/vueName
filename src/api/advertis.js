import request from '@/utils/request'
import qs		from 'qs'
//广告列表
export function advertisList(data) {
	return request({
    url: '/Advertiss/advertisList',
    method: 'post',
    data:qs.stringify(data)
  })
}
//广告添加
export function createData(data) {
	return request({
    url: '/Advertiss/createData',
    method: 'post',
    data:qs.stringify(data)
  })
}
//广告信息
export function categoryMsg(data) {
	return request({
    url: '/Advertiss/categoryMsg',
    method: 'post',
    data:qs.stringify(data)
  })
}

//广告更新
export function updateData(data) {
  return request({
    url: '/Advertiss/updateData',
    method: 'post',
    data:qs.stringify(data)
  })
}

//删除广告
export function deleteData(data) {
  return request({
    url: '/Advertiss/deleteData',
    method: 'post',
    data:qs.stringify(data)
  })
}
//查找广告
export function grabbleData(data) {
  return request({
    url: '/Advertiss/grabbleData',
    method: 'post',
    data:qs.stringify(data)
  })
}