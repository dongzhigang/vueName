import request from '@/utils/request'
import qs		from 'qs'
//查询数据
export function homeData(data) {
	return request({
    url: '/Home/home',
    method: 'post',
    data:qs.stringify(data)
  })
}