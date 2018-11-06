<template>
	<div class="app-box" style="width:100%;">
		<div class="app-top">
			<el-input  placeholder="请输入商品编号" v-model='number'	class="input-wt" clearable ></el-input>
			<el-input  placeholder="请输入商品名称" v-model='name' 	class="input-wt" clearable ></el-input>
			<el-input  placeholder="请输入商品ID" v-model='product_id' 	class="input-wt" clearable ></el-input>
			<el-button type="primary" icon="el-icon-search" @click='grabbleData'>查找</el-button>
			<router-link to="/goods/goodsCreate">
				<el-button type="primary" icon="el-icon-edit" >添加</el-button>
			</router-link>
			<el-button type="primary" icon="el-icon-download" :loading="downloadLoading" @click='handleDownload'>导出</el-button>
		</div>
		<!-- 表格 -->
		<div class="app-table" >
			<el-table :data="tableData" style="width: 100%;text-align: left;" border >
			    <el-table-column type="expand" width='80' >
					<template slot-scope="props">
						<el-form label-position="left" class="table-expand">
							<el-form-item label="宣传画廊">
								<img class="table_gallery" v-for="item in props.row.master" :src="item.path_img"/>
							</el-form-item>
							<el-form-item label="商品介绍">
								<span>{{ props.row.docs }}</span>
							</el-form-item>
							<el-form-item label="商品单位">
								<span>{{ props.row.unit }}</span>
							</el-form-item>
							<el-form-item label="关键字">
								<span>{{ props.row.antistop }}</span>
							</el-form-item>
							<el-form-item label="类目ID">
								<span>{{ props.row.Sort_id }}</span>
							</el-form-item>
							<el-form-item label="品牌商ID">
								<span>{{ props.row.brand_id }}</span>
							</el-form-item>
						</el-form>
					</template>
			    </el-table-column>
			    <el-table-column label="序号" type="index" width="50"></el-table-column>
			    <el-table-column prop="number" label="商品编号" ></el-table-column>
			    <el-table-column prop="product_id" label="商品ID" width="270"></el-table-column>
			    <el-table-column prop="name" label="商品名称" ></el-table-column>
			    <el-table-column prop="img" label="商品缩略图">
			    	<template slot-scope="scope">
						<img :src="scope.row.img" class="table_img" />
					</template>
			    </el-table-column>
			    <el-table-column prop="" label="详情"  >
			    	<template slot-scope="scope">
						<el-button size="mini" type='primary' @click="goodsInfo(scope.row.product_id)">查看</el-button>
					</template>
			    </el-table-column>
			    <el-table-column prop="shop_price" label="专柜价格" ></el-table-column>
			    <el-table-column prop="at_price" label="当前价格" ></el-table-column>
			    <el-table-column prop="new_product" label="是否新品" >
					<template slot-scope="scope">
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium" :type="scope.row.new_product=='1'? 'success':'primary'">{{ scope.row.new_product=='1'?"新品":"非新品" }}</el-tag>
						</div>
					</template>
			    </el-table-column>
			    <el-table-column prop="hot_sale" label="是否热品" >
					<template slot-scope="scope">
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium" :type="scope.row.hot_sale=='1'? 'success':'primary'">{{ scope.row.hot_sale=='1'?"热品":"非热品" }}</el-tag>
						</div>
					</template>
			    </el-table-column>
			    <el-table-column prop="sell" label="是否在售" >
					<template slot-scope="scope">
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium" :type="scope.row.sell=='1'? 'success':'primary'">{{ scope.row.sell=='1'?"在售":"非在售" }}</el-tag>
						</div>
					</template>
			    </el-table-column>
			    <el-table-column prop="time_create" label="添加时间" sortable ></el-table-column>
			    <el-table-column prop="" label="操作" width="150">
					<template slot-scope="scope">
						<el-button size="mini" type='primary' @click="updataData(scope.row.product_id)">编辑</el-button>
						<el-button size="mini" type="danger" @click="deleteData(scope.row.product_id)">删除</el-button>
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
import {fetchList,grabbleData,deleteData,goodsInfo} from '@/api/goods'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
	inject: ['reload'],
	name: 'GoodsList',
	data() {
		return {
			downloadLoading:false,																				//编辑标题
			number: '',																							//用户名
			name:'',
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
			fetchList(this.listQuery).then(function(res){
				if(res.data.code == 0){
					this.tableData = res.data.data.list;
					this.tableCount = res.data.data.count
				}
			}.bind(this)).catch(function(err){

			})
		},
		
	    //删除
	    deleteData(id) {
	    	var data = {'product_id':id}
	    	this.$confirm('确定删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
	        }).then(() => {
				this.$message({
				type: 'success',
				message: '删除成功!'
			});
			deleteData(data).then(res => {
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
	    //编辑
	    updataData(id) {
	    	this.$router.push(
	    		{ path:'/goods/goodsUpdate', query: {id: id }}
	    	);
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
	    		'number':this.number,
	    		'name'	:this.name,
	    		'product_id':this.product_id
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
	width:60px;
	margin: 0 auto;
	display:block;
}
.table_gallery{
	width: 80px;
	margin-right: 10px;
}
</style>