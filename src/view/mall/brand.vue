<template>
	<div class="app-box" style="width:100%;">
		<div class="app-top">
			<el-input  placeholder="请输入品牌商ID" v-model='brand_id'	class="input-wt" clearable ></el-input>
			<el-input  placeholder="请输入品牌商名称" v-model='brand_name' 	class="input-wt" clearable ></el-input>
			<el-button type="primary" icon="el-icon-search" @click='grabbleData'>查找</el-button>
			<el-button type="primary" icon="el-icon-edit" @click="handleAddClick">添加</el-button>
			<el-button type="primary" icon="el-icon-download" :loading="downloadLoading" @click='handleDownload'>导出</el-button>
		</div>
		<!-- 表格 -->
		<div class="app-table" >
			<el-table :data="tableData" style="width: 100%;text-align: left;" border >
			    <el-table-column label="序号" type="index" width="50"></el-table-column>
			    <el-table-column prop="brand_id" label="品牌商ID" width="270"></el-table-column>
			    <el-table-column prop="brand_name" label="品牌商名称" ></el-table-column>
			    <el-table-column prop="icon" label="品牌商图片">
			    	<template slot-scope="scope">
						<img :src="scope.row.icon" class="table_img" />
					</template>
			    </el-table-column>
			    <el-table-column prop="img" label="品牌商图片">
			    	<template slot-scope="scope">
						<img :src="scope.row.img" class="table_img2" />
					</template>
			    </el-table-column>
			    <el-table-column prop="docs" label="介绍"></el-table-column>
			    <el-table-column prop="bot_price" label="低价" ></el-table-column>
			    <el-table-column prop="" label="操作" width="150">
					<template slot-scope="scope">
						<el-button size="mini" type='primary' @click="categoryMsg(scope.row.brand_id)">编辑</el-button>
						<el-button size="mini" type="danger" @click="deleteData(scope.row.brand_id)">删除</el-button>
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
		<!-- 新建和编辑 -->
		<div class="app-from">
			<el-dialog :title="redactTitle?'添加':'编辑'" :visible.sync="dialogFormVisible" style='text-align: left;'>
			 	<el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
				    <el-form-item label="品牌商名称" prop="brand_name">
			          	<el-input v-model="dataForm.brand_name"></el-input>
			        </el-form-item>
			        <el-form-item label="品牌商介绍" prop="docs">
			          	<el-input v-model="dataForm.docs"></el-input>
			        </el-form-item>	
			        <el-form-item label="品牌商图标" prop="icon">
			          	<template>
							<el-upload style="text-align: left;" class="avatar-uploader"
							  :action="Path+'admin/common/fileUploads'"
							  list-type="picture-card"
							  :show-file-list="false"
							  accept=".jpg,.jpeg,.png,.gif" 
							  :on-success="uploadIconProductUrl">
							  <img :src="dataForm.icon" class="avatar" v-if="dataForm.icon">
							  <i class="el-icon-plus avatar-uploader-icon" v-if="!dataForm.icon"></i>
							</el-upload>
						</template>
			        </el-form-item>	
			        <el-form-item label="品牌商图片" prop="img">
			          	<template>
							<el-upload style="text-align: left;" class="avatar-uploader"
							  :action="Path+'admin/common/fileUploads'"
							  list-type="picture-card"
							  :show-file-list="false"
							  accept=".jpg,.jpeg,.png,.gif" 
							  :on-success="uploadProductUrl">
							  <img :src="dataForm.img" class="avatar" v-if="dataForm.img">
							  <i class="el-icon-plus avatar-uploader-icon" v-if="!dataForm.img"></i>
							</el-upload>
						</template>
			        </el-form-item>
			        <el-form-item label="低价" prop="bot_price">
			          	<el-input v-model="dataForm.bot_price"></el-input>
			        </el-form-item>	
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" v-if='redactTitle' @click="createData">确 定</el-button>
					<el-button type="primary"  v-else @click="updateData">确 定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>
<script>
import {brandList,createData,categoryMsg,updateData,deleteData,grabbleData} from '@/api/brand'
import FileSaver from 'file-saver'
import Path from "@/api/path"
import XLSX from 'xlsx'
export default {
	inject: ['reload'],
	name: 'Brand',
	data() {
		return {
			Path:Path,					//域名
			downloadLoading:false,		//导出加载显示隐藏																		
			brand_id: '',		//品牌商ID																			
			brand_name:'',		//品牌商名称
			tableData: [],		//表格数据
			tableCount:0,
			listQuery: {
			'page': 1,
			'rows': 10
			},
			//表单显示隐藏
			dialogFormVisible:false,
			//编辑类型
			redactTitle:false,
			//表单数据
			dataForm: {
				brand_name: '',														//品牌商名称
				img:'',																//品牌商图片
				icon:'',
				docs: '',															//简介
				bot_price:''
			},
			//验证表单
			rules: {
				brand_name: [{ required: true, message: '类目名称不能为空', trigger: 'blur' }],
			},
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
		//编辑信息
	    categoryMsg(id) {
	    	this.dialogFormVisible = true;
			this.redactTitle = false
	    	var data = {
		    		'brand_id':id
		    	}	
	    	categoryMsg(data).then(function(res){
	    		if(res.data.code === 0){
	    			this.dataForm = res.data.data
	    			if(res.data.data.Cate_name){
	    				this.dataForm.name = res.data.data.Cate_name
	    			}else{
	    				this.dataForm.name = res.data.data.Sort_name
	    			}
	    			this.dataForm.checkPassword = this.dataForm.password
	    		}
	    	}.bind(this))
	    },
		//新建选择
		handleAddClick(){
			this.dialogFormVisible = true;
			this.redactTitle = true
			this.dataForm = {
				brand_name: '',														//品牌商名称
				img:'',	
				icon:'',															//品牌商图片
				docs: '',															//简介
				bot_price:''
			}
		},
		//查询列表
		getList(){
			brandList(this.listQuery).then(function(res){
				if(res.data.code == 0){
					this.tableData = res.data.data.list;
					this.tableCount = res.data.data.count
				}
			}.bind(this)).catch(function(err){

			})
		},
		//品牌商图片返回值
		uploadProductUrl(res, file, fileLis) {
			this.dataForm.img = this.Path + res.data[0]
		},
		//品牌商图标返回值
		uploadIconProductUrl(res, file, fileLis){
			this.dataForm.icon = this.Path + res.data[0]
		},
		// 新建
		createData() {
		  this.$refs['dataForm'].validate((valid) => {
		    if (valid) {
		    	console.log(this.dataForm);
				createData(this.dataForm).then(res => {
					console.log(res)
					if(res.data.code == 0){
					//提示
				    this.$notify({
				      title: '成功',
				      message: '创建成功',
				      type: 'success',
				      duration: 2000
				    })
				    //刷新组件
		            this.reload();
				  }
				})
		    }
		  })
		},
		//编辑更新
	    updateData() {
	    	console.log(this.dataForm)
	    	this.$refs['dataForm'].validate((valid) => {
	        if (valid) {
	          updateData(this.dataForm).then(res => {
	          	if(res.data.code == 0){
		            this.dialogFormVisible = false
					//提示
		            this.$notify({
		              title: '成功',
		              message: '更新成功',
		              type: 'success',
		              duration: 2000
		            })
		            //刷新组件
		            this.reload()
		          }
	          })
	        }
	      })
	    },		
	    //删除品牌商
	    deleteData(id) {
	    	var data = {'brand_id':id}
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
	    //模糊查找
	    grabbleData() {
	    	var data = {
	    		'brand_id' :this.brand_id,
	    		'brand_name' :this.brand_name
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
				const tHeader = ['品牌商名称', '品牌商图片', '品牌商介绍','品牌商低价']
				const filterVal = ['brand_name', 'img', 'docs', 'bot_price']
				const list = this.tableData;
				const data = this.formatJson(filterVal, list);
				export_json_to_excel(tHeader, data, '品牌商信息');
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
	width:50px;
	margin: 0 auto;
	display:block;
}
.table_img2{
	width:190px;
	margin: 0 auto;
	display:block;
}
.table_gallery{
	width: 80px;
	margin-right: 10px;
}
.avatar-uploader .el-upload {
border: 1px dashed #d9d9d9;
border-radius: 6px;
cursor: pointer;
position: relative;
overflow: hidden;
}
.avatar{
	width: 146px;
	height: 146px;
}
.el-dialog{
	max-width: 80%;
}
</style>