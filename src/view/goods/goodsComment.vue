<template>
	<div class="app-box" style="width:100%;">
		<div class="app-top">
			<el-input  placeholder="请输入用户id" v-model='user_id'	class="input-wt" clearable ></el-input>
			<el-input  placeholder="请输入商品id" v-model='product_id' 	class="input-wt" clearable ></el-input>
			<el-button type="primary" icon="el-icon-search" @click='grabbleData'>查找</el-button>
			<el-button type="primary" icon="el-icon-download" :loading="downloadLoading" @click='handleDownload'>导出</el-button>
		</div>
		<!-- 表格 -->
		<div class="app-table" >
			<el-table :data="tableData" style="width: 100%;text-align: left;" border >
			    <el-table-column label="序号" type="index" width="50"></el-table-column>
			    <el-table-column prop="user_id" label="用户id" width="270"></el-table-column>
			    <el-table-column prop="product_id" label="商品id"  width="270"></el-table-column>
			    <el-table-column prop="content" label="评论内容" ></el-table-column>
			    <el-table-column prop="comment_img" label="评论图片">
			    	<template slot-scope="props">
			    		<div class="table_img">
			    			<img v-for="item in props.row.comment_img" :src="item.pathUrl"/>
			    		</div>
			    	</template>
			    </el-table-column>
			    <el-table-column prop="grade" label="评分" width="200" >
					<template slot-scope="scope">
						<el-rate v-model="scope.row.grade" :texts="texts" disabled show-text></el-rate>
					</el-rate>
					</template>
			    </el-table-column>
			    <el-table-column prop="add_date" label="添加时间" sortable ></el-table-column>
			    <el-table-column prop="" label="操作" width="150">
					<template slot-scope="scope">
						<el-button size="mini" type='primary' @click="updataData()">回复</el-button>
						<el-button size="mini" type="danger" @click="deleteComment(scope.row.comment_id)">删除</el-button>
					</template>
			    </el-table-column>
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

		<!-- 详情 -->
		<el-dialog
		title="商品详情"
		:visible.sync="contentDialogVisible"
		center>
			<div v-html="content"></div>
		</el-dialog>
	</div>
</template>
<script>
import {goodsComment,grabbleComment,deleteComment} from '@/api/goods'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
	inject: ['reload'],
	name: 'GoodsComment',
	data() {
		return {
			downloadLoading:false,																					//导出加载
			user_id: '',																							//用户id
			product_id:'',
				// 表格数据
			tableData: [],
			tableCount:0,																						//表格总条数
			//查询请求参数
			listQuery: {
			'page': 1,
			'rows': 10
			},
			content:'',
			contentDialogVisible:false,
			texts:['非常差','差','一般','满意','非常满意'],
		};
    },
	methods: {
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
			goodsComment(this.listQuery).then(function(res){
				console.log(res)
				if(res.data.code == 0){
					this.tableData = res.data.data.list;
					this.tableCount = res.data.data.count
				}
			}.bind(this)).catch(function(err){

			})
		},
		
	    //删除
	    deleteComment(id) {
	    	var data = {'comment_id':id}
	    	this.$confirm('确定删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
	        }).then(() => {
				this.$message({
				type: 'success',
				message: '删除成功!'
			});
			deleteComment(data).then(res => {
				if(res.data.code == 0){           
				// this.$router.go(0)
					console.log(res)
					//刷新组件
					this.reload()
				}
			})
	        }).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
	        });
	    },
	    //回复
	    updataData() {
			this.$alert('商品评论回复暂时不支持', '失败', {
				confirmButtonText: '确定',
				type:'error',
				callback: action => {
				}
			});
	    },
	    //商品详情
	    goodsInfo(id) {
	    	this.contentDialogVisible = true;
	    	var data = {'product_id':id}
	    	goodsInfo(data).then(function(res){
	    		console.log(res)
	    		if(res.data.code == 0){
	    			this.content = res.data.data.contents
	    		}
	    	}.bind(this))
	    },
	    //模糊查找
	    grabbleData() {
	    	var data = {
	    		'user_id':this.user_id,
	    		'product_id':this.product_id,
	    		'page': this.listQuery.page,
	    		'rows':this.listQuery.rows
	    	}
	    	grabbleComment(data).then(function(res){
	    		if(res.data.code == 0){
	    			this.tableData  = res.data.data.list
	    			this.tableCount = res.data.data.count
	    		}
	    	}.bind(this))
	    },
	    //导出
	    handleDownload() {
	    	this.downloadLoading = true
			require.ensure([], () => {
				const { export_json_to_excel } = require('../../vendor/Export2Excel');
				const tHeader = ['商品编号', '商品名称', '商品缩略图', '专柜价格','当前价格','是否新品','是否热品','是否在售','添加时间']
				const filterVal = ['number', 'name', 'img', 'shop_price', 'at_price','new_product', 'hot_sale', 'sell', 'time_create']
				const list = this.tableData;
				const data = this.formatJson(filterVal, list);
				export_json_to_excel(tHeader, data, '商品信息');
				this.downloadLoading = false
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
a{
	text-decoration: none;
	color: #fff;
}
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
.table_img{
	margin: 0 auto;
	display:block;
}
.table_img img{
	width: 60px;
	margin:0 5px;
}
.table_gallery{
	width: 80px;
	margin-right: 10px;
}
</style>