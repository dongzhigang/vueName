import {LoginByAdminname} from '@/api/login'
const admin = {
	state:{
		userinfo:'',				//管理员信息
		isLogin:0					//判断是否登录
	},
	mutations:{
		SET_USERINFO:function(state,userinfo){
			state.userinfo = userinfo
		},
		SET_ISLOGIN:function(state,code){
			state.isLogin = code
		}
	},
	actions:{
		//登录
		LoginByAdminname({ commit },userinfo) {
			let adminName = userinfo.adminName.trim()
			return new Promise(function(resolve, reject){
				LoginByAdminname(userinfo.adminName,userinfo.password).then(function(res){
					if(res.data.code==0){
						let userinfo = res.data.data
						console.log(userinfo)
						commit('SET_USERINFO',userinfo)
						commit('SET_ISLOGIN',100)
					}
					resolve(res)
				}).catch(error => {
					reject(error)
		        })
			})
		}
	}
}
export default admin