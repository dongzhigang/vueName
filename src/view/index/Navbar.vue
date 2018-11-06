<template>
	<div class="navbar">
		<!-- 侧栏切换 -->
		<el-radio-group v-model="$store.state.app.hasSwitch" style="margin-bottom: 20px;margin:0; display: inline-block;" @change="$store.commit('SwitchView')">
			<el-radio-button :label="false" v-if='!$store.getters.SwitchView'><i class="el-icon-ump-daohang icon-daohang"></i></el-radio-button>
			<el-radio-button :label="true"  v-if='$store.getters.SwitchView'><i class="el-icon-ump-daohang icon-daohang"></i></el-radio-button>
		</el-radio-group>
		<!-- 导航标签 -->
		<el-breadcrumb class="app-head-bread" separator="/">
			<transition-group name="breadcrumb">
				<el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if='item.meta.title'>
					<span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{item.meta.title}}</span>
					<router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
				</el-breadcrumb-item>
			</transition-group>
		</el-breadcrumb>
		<!-- 用户导航 -->
		<div class="app-head-right">
			<el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
		      <i class="el-icon-ump-quanping app-head-iconrank" @click="fullScreen()"></i>
		    </el-tooltip>
			<!-- <i class="el-icon-ump-quanping app-head-iconrank" @click="fullScreen()"></i> -->
			<img :src="userinfo.adminPath" class="app-head-img">{{userinfo.adminName}}
			<el-dropdown class='app-head-down'>
				<i class="el-icon-caret-bottom el-icon--right"></i>
				<el-dropdown-menu slot="dropdown">
				<el-dropdown-item>黄金糕</el-dropdown-item>
				<el-dropdown-item>狮子头</el-dropdown-item>
				<el-dropdown-item>退出登录</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>

<script >	
	import screenfull from 'screenfull'
	import user from '@/assets/userLogo.gif'
	import { mapGetters } from 'vuex'
	export default {
		name:'Navbar',
		data () {
			return {
				user:user,
				levelList: null,
			}
		},
		computed:{
			...mapGetters(['userinfo'])
		},
		methods: {
			getBreadcrumb() {
				let matched = this.$route.matched
				const first = matched[1]
				if (first && first.name !== 'dashboard') {
					matched = [{ path: '/dashboard', meta: { title: '主页' }}].concat(matched)
				}
				this.levelList = matched
			},
			fullScreen() {
				if (!screenfull.enabled) { // 如果不允许进入全屏，发出不允许提示
			        this.$message({
			          message: '不支持全屏',
			          type: 'warning'
			        })
			        return false
			    }
		     	screenfull.toggle()
			}
		},
		watch: {
			$route() {
				this.getBreadcrumb()
			}
		},
		created() {
			this.getBreadcrumb()
		},
		mounted(){
			console.log(this.userinfo)
		}
	}
</script>
<style scoped>
	.icon-daohang{
		font-size: 26px;
	}
	.navbar{
		text-align: left;
		width: 100%;
		padding: 10px 0;
		margin-left:10px;
		display: flex;
		align-items: center;
	}
	.app-head-bread{
		display: inline-block;
		margin-left: 10px;
	}
	.app-head-right{
		position: absolute;
		right: 10px;
		display: flex;
		align-items: center;
	}
	.app-head-iconrank{
		font-size: 20px;
		color: #5a5e66;
	}
	.app-head-img{
		width: 30px;
		margin-left: 20px;
		border-radius: 10px;
	}
	.app-head-down{
		margin-left: 10px;
	}
	.no-redirect{
		color: #97a8be;
    	cursor: text;
	}
	.bottom {
      clear: both;
      text-align: center;
    }

</style>
<style>	
	.navbar .el-radio-button__inner{
		padding: 0 !important;
		border: 0 !important;
	}
</style>