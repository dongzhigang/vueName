import request from '@/utils/request'
import qs		from 'qs'
//查询数据
export function fetchList(data) {
	return request({
    url: '/collects/fetchList',
    method: 'post',
    data:qs.stringify(data)
  })
}
//模糊搜索
export function grabbleData(params){
	return request({
    url: '/collects/grabbleData',
    method: 'get',
    params
  })
}