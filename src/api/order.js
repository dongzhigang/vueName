import request from '@/utils/request'
import qs		from 'qs'
//品牌商列表
export function orderList(data) {
	return request({
    url: '/Orders/orderList',
    method: 'post',
    data:qs.stringify(data)
  })
}
//查找品牌商
export function grabbleData(data) {
  return request({
    url: '/Orders/grabbleData',
    method: 'post',
    data:qs.stringify(data)
  })
}