<template>
	<div class="navbar">
		<!-- 侧栏切换 -->
		<el-radio-group v-model="$store.state.app.hasSwitch" style="margin-bottom: 20px;margin:0; display: inline-block;" @change="$store.commit('SwitchView')">
			<el-radio-button :label="false" v-if='!$store.getters.SwitchView'><i class="el-icon-ump-daohang icon-daohang"></i></el-radio-button>
			<el-radio-button :label="true"  v-if='$store.getters.SwitchView'><i class="el-icon-ump-daohang icon-daohang"></i></el-radio-button>
		</el-radio-group>
		<!-- 导航标签 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" class="app-head-bread">
		  <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
		  <el-breadcrumb-item>活动管理</el-breadcrumb-item>
		  <el-breadcrumb-item>活动列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 用户导航 -->
		<div class="app-head-right">
			<i class="el-icon-ump-quanping app-head-iconrank"></i>
			<img :src="user" class="app-head-img">
			<el-dropdown class='app-head-down'>
			  <i class="el-icon-caret-bottom el-icon--right"></i>
			  <el-dropdown-menu slot="dropdown">
			    <el-dropdown-item>黄金糕</el-dropdown-item>
			    <el-dropdown-item>狮子头</el-dropdown-item>
			    <el-dropdown-item>螺蛳粉</el-dropdown-item>
			    <el-dropdown-item disabled>双皮奶</el-dropdown-item>
			    <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
			  </el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>

<script >
	import user from '@/assets/userLogo.gif'
	export default {
		name:'Navbar',
		data () {
			return {
				user:user
			}
		},
		methods: {
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
		width: 40px;
		height: 40px;
		margin-left: 20px;
		border-radius: 10px;
	}
	.app-head-down{
		margin-left: 10px;
	}
</style>
<style>	
	.navbar .el-radio-button__inner{
		padding: 0 !important;
		border: 0 !important;
	}
</style>