<template>
	<div style="width:100%;">
		<el-row :gutter="20">
		  <el-col :md="12" :lg="6"  class="dash-col">
		  	<div class="dash-lt">
		  		<i class="el-icon-ump-duouser icon-green bg-purple"></i>
		  	</div>
		  	<div class="dash-rt">
		  		<span class="dash-rt-title">用户数量</span>
		  		<!-- <span class="dash-rt-num">{{home.userCount}}</span> -->
		  		<count-to class="card-panel-num" :startVal="0" :endVal="home.userCount" :duration="3600"></count-to>
		  	</div>
		  </el-col>
		 <el-col :md="12" :lg="6"  class="dash-col">
		  	<div class="dash-lt">
		  		<i class="el-icon-ump-gouwuche icon-blue bg-purple"></i>
		  	</div>
		  	<div class="dash-rt">
		  		<span class="dash-rt-title">购物数量</span>
		  		<!-- <span class="dash-rt-num">{{home.CarCount}}</span> -->
		  		<count-to class="card-panel-num" :startVal="0" :endVal="home.CarCount" :duration="3600"></count-to>
		  	</div>
		  </el-col>
		  <el-col :md="12" :lg="6"  class="dash-col">
		  	<div class="dash-lt">
		  		<i class="el-icon-ump-huopinshuliang icon-red bg-purple"></i>
		  	</div>
		  	<div class="dash-rt">
		  		<span class="dash-rt-title">商品数量</span>
		  		<count-to class="card-panel-num" :startVal="0" :endVal="home.goodsCount" :duration="3600"></count-to>
		  	</div>
		  </el-col>
		  <el-col :md="12" :lg="6"  class="dash-col">
		  	<div class="dash-lt">
		  		<i class="el-icon-ump-jinqian icon-green2 bg-purple"></i>
		  	</div>
		  	<div class="dash-rt">
		  		<span class="dash-rt-title">订单数量</span>
		  	<!-- 	<span class="dash-rt-num">{{home.OrderCount}}</span> -->
		  		<count-to class="card-panel-num" :startVal="0" :endVal="home.OrderCount" :duration="3600"></count-to>
		  	</div>
		  </el-col>
		</el-row>
	</div>
</template>
<script>
	import {homeData} from '@/api/home'
	import CountTo from 'vue-count-to'
	export default {
		components: {
			CountTo
		},
		name:'Dashboard',
		data(){
			return {
				home:{
					CarCount:0,
					OrderCount:0,
					goodsCount:0,
					userCount:0
				}
			}
		},
		methods: {
			homeData() {
				homeData().then(function(res){
					console.log(res)
					if(res.data.code == 0){
						this.home = res.data.data
						console.log(this.home)
					}
				}.bind(this))
			}
		},
		/**
	     * 生命周期
	     * @return {[type]} [description]
	     */
	    mounted() {
	      //查询数据
	    	this.homeData();
	    }
	}
</script>
<style scoped>
	.dash-col{
		display: flex;
		align-items: center;
		box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
		padding: 20px;
	}
	.bg-purple{
		padding: 10px;		
		border-radius: 5px;
		font-size: 50px;
		cursor: pointer;
	}
	.icon-green:hover{
		color: #fff;
		background: #40c9c6;
	}
	.icon-green{
		color: #40c9c6;
	}
	.icon-green2:hover{
		color: #fff;
		background: #34bfa3;
	}
	.icon-green2{
		color: #34bfa3;
	}
	.icon-blue:hover{
		color: #fff;
		background: #36a3f7;
	}
	.icon-blue{
		color: #36a3f7;
	}
	.icon-red:hover{
		color: #fff;
		background: #f4516c;
	}
	.icon-red{
		color: #f4516c;
	}
	

	.dash-lt{
		text-align: left;
		width: 70%;
	}
	.dash-rt{
		text-align: left;
	}
	.dash-rt span{

		display: block;
	}
	.dash-rt-title{
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 10px;
    color: rgba(0, 0, 0, 0.45);
	}
	.dash-rt-num{
		font-size: 18px;
	}
</style>