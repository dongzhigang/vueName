<template>
	<div class="app-box" style="width:100%;">
		<div class="app-top">
			<el-input  placeholder="请输入广告标题" v-model='title'	class="input-wt" clearable ></el-input>
			<el-input  placeholder="请输入广告内容" v-model='content' 	class="input-wt" clearable ></el-input>
			<el-button type="primary" icon="el-icon-search" @click='grabbleData'>查找</el-button>
			<el-button type="primary" icon="el-icon-edit" @click="handleAddClick">添加</el-button>
			<el-button type="primary" icon="el-icon-download" :loading="downloadLoading" @click='handleDownload'>导出</el-button>
		</div>
		<!-- 表格 -->
		<div class="app-table" >
			<el-table :data="tableData" style="width: 100%;text-align: left;" border >
			    <el-table-column label="序号" type="index" width="50"></el-table-column>
			    <el-table-column prop="advertis_id" label="广告ID" width="270"></el-table-column>
			    <el-table-column prop="title" label="广告标题" ></el-table-column>
			    <el-table-column prop="content" label="广告内容" ></el-table-column>
			    <el-table-column prop="img" label="广告图片" width="270">
			    	<template slot-scope="scope">
						<img :src="scope.row.img" class="table_img" />
					</template>
			    </el-table-column>
			    <el-table-column prop="location" label="广告位置"></el-table-column>
			    <el-table-column prop="path" label="广告链接"></el-table-column>
			    <el-table-column prop="start" label="是否启用" >
			    	<template slot-scope="scope">
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium" :type="scope.row.start=='1'?'success':'primary'">{{ scope.row.start=='1'?"启用":"不启用" }}</el-tag>
						</div>
					</template>
			    </el-table-column>
			    <el-table-column prop="" label="操作" width="150">
					<template slot-scope="scope">
						<el-button size="mini" type='primary' @click="categoryMsg(scope.row.advertis_id)">编辑</el-button>
						<el-button size="mini" type="danger" @click="deleteData(scope.row.advertis_id)">删除</el-button>
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
				    <el-form-item label="广告标题" prop="title">
			          	<el-input v-model="dataForm.title"></el-input>
			        </el-form-item>
			        <el-form-item label="广告内容" prop="content">
			          	<el-input v-model="dataForm.content"></el-input>
			        </el-form-item>		
			        <el-form-item label="广告图片" prop="img">
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
			        <el-form-item label="广告位置" prop="location">
			          	<el-input v-model="dataForm.location"></el-input>
			        </el-form-item>	
			        <el-form-item label="活动链接" prop="path">
			          	<el-input v-model="dataForm.path"></el-input>
			        </el-form-item>	
			        <el-form-item label="是否启用" prop="start">
			          	<el-select v-model="dataForm.start" @change="startValue" >
							<el-option label="启用" value="1">
							</el-option>
							<el-option label="不启用" value="0">
							</el-option>
						</el-select>
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
import {advertisList,createData,categoryMsg,updateData,deleteData,grabbleData} from '@/api/advertis'
import FileSaver from 'file-saver'
import Path from "@/api/path"
import XLSX from 'xlsx'
export default {
	inject: ['reload'],
	name: 'Advertis',
	data() {
		return {
			Path:Path,					//域名
			downloadLoading:false,		//导出加载显示隐藏																		
			title: '',		//品牌商ID																			
			content:'',		//品牌商名称
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
				title: '',														//广告标题
				img:'',															//广告图片
				content: '',													//广告内容
				start:'0',														//广告状态
				path: '',														//链接
				location:''														//广告位置
			},
			//验证表单
			rules: {
				title: [{ required: true, message: '类目名称不能为空', trigger: 'blur' }],
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
		    		'advertis_id':id
		    	}	
	    	categoryMsg(data).then(function(res){
	    		console.log(res)
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
				title: '',														//广告标题
				img:'',															//广告图片
				content: '',													//广告内容
				start:'0',														//广告状态
				path: '',														//链接
				location:''														//广告位置
			}
		},
		//启用状态
		startValue() {

		},
		//查询列表
		getList(){
			advertisList(this.listQuery).then(function(res){
				console.log(res)
				if(res.data.code == 0){
					this.tableData = res.data.data.list;
					// this.classOptions = res.data.data.list.map(function(v,i){
					// 	var obj = {};
					// 	obj.label = v.Cate_name;
					// 	obj.value = v.Cate_id;
					// 	return obj
					// });
					this.tableCount = res.data.data.count
				}
			}.bind(this)).catch(function(err){

			})
		},
		//广告图片返回值
		uploadProductUrl(res, file, fileLis) {
			this.dataForm.img = this.Path + res.data[0]
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
	    //删除广告
	    deleteData(id) {
	    	var data = {'advertis_id':id}
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
	    		'title' :this.title,
	    		'content' :this.content
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
	width:250px;
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