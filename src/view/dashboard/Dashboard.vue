<template>
	<div style="width:100%;">
		<el-row :gutter="20">
		  <el-col :md="12" :lg="6"  class="dash-col">
		  	<div class="dash-lt">
		  		<i class="el-icon-ump-duouser icon-green bg-purple"></i>
		  	</div>
		  	<div class="dash-rt">
		  		<span class="dash-rt-title">用户数量</span>
		  		<span class="dash-rt-num">3</span>
		  	</div>
		  </el-col>
		 <el-col :md="12" :lg="6"  class="dash-col">
		  	<div class="dash-lt">
		  		<i class="el-icon-ump-gouwuche icon-blue bg-purple"></i>
		  	</div>
		  	<div class="dash-rt">
		  		<span class="dash-rt-title">商品数量</span>
		  		<span class="dash-rt-num">3</span>
		  	</div>
		  </el-col>
		  <el-col :md="12" :lg="6"  class="dash-col">
		  	<div class="dash-lt">
		  		<i class="el-icon-ump-huopinshuliang icon-red bg-purple"></i>
		  	</div>
		  	<div class="dash-rt">
		  		<span class="dash-rt-title">货品数量</span>
		  		<span class="dash-rt-num">3</span>
		  	</div>
		  </el-col>
		  <el-col :md="12" :lg="6"  class="dash-col">
		  	<div class="dash-lt">
		  		<i class="el-icon-ump-jinqian icon-green2 bg-purple"></i>
		  	</div>
		  	<div class="dash-rt">
		  		<span class="dash-rt-title">订单数量</span>
		  		<span class="dash-rt-num">3</span>
		  	</div>
		  </el-col>
		</el-row>
	</div>
</template>
<script>
	export default {
		name:'Dashboard'
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