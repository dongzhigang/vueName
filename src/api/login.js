import request from '@/utils/request'
import qs		from 'qs'
//登录
export function LoginByAdminname(adminName,password) {
	const data = {
	    adminName,
	    password
	  }
	return request({
    url: '/login/LoginByAdminname',
    method: 'post',
    data:qs.stringify(data)
  })
}