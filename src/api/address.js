import request from '@/utils/request'
import qs		from 'qs'
//查询数据
export function fetchList(data) {
	return request({
    url: '/addresss/fetchList',
    method: 'post',
    data:qs.stringify(data)
  })
}
//模糊搜索
export function grabbleData(params){
	return request({
    url: '/addresss/grabbleData',
    method: 'get',
    params
  })
}