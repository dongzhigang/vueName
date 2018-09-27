<template>
	<div class="app-box" style="width:100%;">
		<div class="app-top">
			<el-input  placeholder="请输入用户ID" v-model='user_id'	class="input-wt" clearable @change='nameChange'></el-input>
			<el-input  placeholder="请输入收货人名称" v-model='name'	class="input-wt" clearable @change='mobileChange'></el-input>
			<el-button type="primary" icon="el-icon-search" @click='grabbleData'>查找</el-button>
			<el-button type="primary" icon="el-icon-download" :loading="downloadLoading" @click='handleDownload'>导出</el-button>
		</div>
		<!-- 表格 -->
		<div class="app-table" >
			<el-table :data="tableData" style="width: 100%;text-align: left;" border>
				<el-table-column prop="address_id" label="地址ID" sortable width='300' ></el-table-column>
			    <el-table-column prop="user_id" label="用户ID" sortable width='300' ></el-table-column>
			    <el-table-column prop="name" label="收货人" ></el-table-column>
			    <el-table-column prop="mobile" label="手机号码" ></el-table-column>
			    <el-table-column prop="address" label="收货地址" ></el-table-column>
			    <el-table-column prop="code" label="邮政编码" ></el-table-column>
			    <el-table-column prop="Default" label="默认" ></el-table-column>
			    <el-table-column prop="time_create" label="创建时间" ></el-table-column>
		  </el-table>
		</div>
		<!-- 分页 -->
		<div class="page-block">
			<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			background
			:page-sizes="[10, 20, 30, 50]"
			:page-size="listQuery.rows"
			layout="total, sizes, prev, pager, next, jumper"
			:total="tableCount">
			</el-pagination>
		</div>
	</div>
</template>
<script>
import {fetchList,grabbleData} from '@/api/address'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
	inject: ['reload'],
	name: 'Address',
	data() {
		return {
			downloadLoading:false,
			redactTitle:false,																						//编辑标题
			user_id: '',																									//用户名
			name:'',
				// 表格数据
			tableData: [],
			tableCount:0,																									//表格总条数
			//查询请求参数
			listQuery: {
				'page': 1,
				'rows': 10
			}
		};
    },
	methods: {
		nameChange(val) {
			console.log(val)
			this.userName = val
		},
		mobileChange(val) {
			console.log(val)
			this.mobile = val
		},
		//选中 input 中的文字
		handleSelect(item) {
			this.tableData= [item]
			this.tableCount = 1
		},
		// 选择每页条数
		handleSizeChange (value) {
			this.listQuery.rows = value
			this.getList()
		},
		// 第几页
		handleCurrentChange(value){
			this.listQuery.page = value
			this.getList()
		},
		//查询列表
		getList(){
			fetchList(this.listQuery).then(function(res){
				if(res.data.code == 0){
					this.tableData = res.data.data.list;
					this.tableCount = res.data.data.count
				}
			}.bind(this)).catch(function(err){

			})
		},
	    //模糊查找
	    grabbleData() {
	    	var data = {
	    		'user_id'  	:this.user_id,
	    		'name'		:this.name
	    	}
	    	grabbleData(data).then(function(res){
	    		if(res.data.code == 0){
	    			this.tableData  = res.data.data.list
	    			this.tableCount = res.data.data.count
	    		}
	    	}.bind(this))
	    },
	    //导出
	    handleDownload() {
			require.ensure([], () => {
				const { export_json_to_excel } = require('../../vendor/Export2Excel');
				const tHeader = ['用户名', '手机号码', '性别', '生日', '状态']
				const filterVal = ['userName', 'mobile', 'sex', 'birthday', 'state']
				const list = this.tableData;
				const data = this.formatJson(filterVal, list);
				export_json_to_excel(tHeader, data, '收货地址');
			})
	    },
		formatJson(filterVal, jsonData) {
			return jsonData.map(v => filterVal.map(j => v[j]))
		}
    },
    /**
     * 生命周期
     * @return {[type]} [description]
     */
    mounted() {
      //查询数据
    	this.getList();
    }
}	
</script>
<style scoped>
.app-top{
	text-align:left;
}
.input-wt{
	width: 200px;
	margin-right: 10px;
}
.app-table{
	margin-top: 20px;
	text-align: left;
}
.page-block{
	text-align: left;
	margin-top: 20px;
}
</style>