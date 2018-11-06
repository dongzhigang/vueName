<template>
	<div class="app-box" style="width:100%;">
		<div class="app-top">
			<el-input  placeholder="请输入类目ID" v-model='Cate_id'	class="input-wt" clearable ></el-input>
			<el-input  placeholder="请输入类目名称" v-model='Cate_name' 	class="input-wt" clearable ></el-input>
			<el-button type="primary" icon="el-icon-search" @click='grabbleData'>查找</el-button>
			<el-button type="primary" icon="el-icon-edit" @click="handleAddClick">添加</el-button>
			<el-button type="primary" icon="el-icon-download" :loading="downloadLoading" @click='handleDownload'>导出</el-button>
		</div>
		<!-- 一级类目表格 -->
		<div class="app-table" >
			<el-table :data="tableData" style="width: 100%;text-align: left;" border >
			    <el-table-column label="序号" type="index" width="50"></el-table-column>
			    <el-table-column prop="Cate_id" label="类目ID" width="270"></el-table-column>
			    <el-table-column prop="Cate_name" label="类目名称" ></el-table-column>
			    <el-table-column prop="icon" label="类目图标">
			    	<template slot-scope="scope">
						<img :src="scope.row.icon" class="table_img" />
					</template>
			    </el-table-column>
			    <el-table-column prop="img" label="类目图片">
			    	<template slot-scope="scope">
						<img :src="scope.row.img" class="table_img2" />
					</template>
			    </el-table-column>
			    <el-table-column prop="docs" label="简介" ></el-table-column>
			    <el-table-column label="级别" >
					<template slot-scope="scope">
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium" type="primary">一级类目</el-tag>
						</div>
					</template>
			    </el-table-column>
			    <el-table-column label="二级类目" >
					<template slot-scope="scope">
						<div slot="reference" class="name-wrapper" >
							<el-button size="mini" type='primary' @click="secondData(scope.$index)">查看</el-button>
						</div>
					</template>
			    </el-table-column>
			    <el-table-column prop="" label="操作" width="150">
					<template slot-scope="scope">
						<el-button size="mini" type='primary' @click="categoryMsg(scope.row.Cate_id)">编辑</el-button>
						<el-button size="mini" type="danger" @click="deleteData(scope.row.Cate_id)">删除</el-button>
					</template>
			    </el-table-column>
			 </el-table>
		</div>
		<!-- 二级类目表格 -->
		<el-dialog title="二级类目" :visible.sync="dialogTableCategoryVisible" width="90%">
			<div class="app-table" >
				<el-table :data="twoTableData" style="width: 100%;text-align: left;" border >
				    <el-table-column label="序号" type="index" width="50"></el-table-column>
				    <el-table-column prop="Sort_id" label="类目ID" width="280"></el-table-column>
				    <el-table-column prop="Sort_name" label="类目名称" ></el-table-column>
				    <el-table-column prop="icon" label="类目图标">
				    	<template slot-scope="scope">
							<img :src="scope.row.icon" class="table_img" />
						</template>
				    </el-table-column>
				    <el-table-column prop="img" label="类目图片">
				    	<template slot-scope="scope">
							<img :src="scope.row.img" class="table_img2" />
						</template>
				    </el-table-column>
				    <el-table-column prop="docs" label="简介" ></el-table-column>
				    <el-table-column label="级别" >
						<template slot-scope="scope">
							<div slot="reference" class="name-wrapper">
								<el-tag size="medium" type="primary">二级类目</el-tag>
							</div>
						</template>
				    </el-table-column>
				     <el-table-column prop="Cate_id" label="父类目ID" width="270"></el-table-column>
				    <el-table-column prop="" label="操作" width="150">
						<template slot-scope="scope">
							<el-button size="mini" type='primary' @click="twoCategoryMsg(scope.row.Sort_id)">编辑</el-button>
							<el-button size="mini" type="danger" @click="twoDeleteData(scope.row.Cate_id)">删除</el-button>
						</template>
				    </el-table-column>
				 </el-table>
			</div>
		</el-dialog>
		<!-- 新建和编辑 -->
		<div class="app-from">
			<el-dialog :title="redactTitle?'添加':'编辑'" :visible.sync="dialogFormVisible" style='text-align: left;'>
			 	<el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
				    <el-form-item label="类目名称" prop="name">
			          	<el-input v-model="dataForm.name"></el-input>
			        </el-form-item>
			        <el-form-item label="级别" prop="grade">
			          	<el-select v-model="dataForm.grade>1?'二级类目':'一级类目'" @change="categoryValue" 
			          		:disabled="redactTitle?false:true">
							<el-option label="一级类目" :value="1">
							</el-option>
							<el-option label="二级类目" :value="2">
							</el-option>
						</el-select>
			        </el-form-item>   
			        <el-form-item label="父类目" style='text-align: left;' v-if="dataForm.grade>1">
						<template>
							<el-select v-model="classValue" placeholder="请选择"  @change="parentCategory">
								<el-option
								v-for="item in classOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</template>
			        </el-form-item>
			        <el-form-item label="类目图标" prop="icon">
			          	<template>
							<el-upload style="text-align: left;" class="avatar-uploader"
							  :action="Path+'admin/common/fileUploads'"
							  list-type="picture-card"
							  :show-file-list="false"
							  accept=".jpg,.jpeg,.png,.gif" 
							  :on-success="uploadIconUrl">
							  <img :src="dataForm.icon" class="avatar" v-if="dataForm.icon">
							  <i class="el-icon-plus avatar-uploader-icon" v-if="!dataForm.icon"></i>
							</el-upload>
						</template>
			        </el-form-item>
			         <el-form-item label="类目图片" prop="img">
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
			         <el-form-item label="类目简介" prop="docs">
			          	<el-input v-model="dataForm.docs"></el-input>
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
import {classifyList,createData,categoryMsg,updateData,deleteData,twoDeleteData,grabbleData} from '@/api/category'
import FileSaver from 'file-saver'
import Path from "@/api/path"
import XLSX from 'xlsx'
export default {
	inject: ['reload'],
	name: 'Category',
	data() {
		return {
			Path:Path,					//域名
			downloadLoading:false,		//导出加载显示隐藏	
			dialogTableCategoryVisible:false,																		
			Cate_id: '',		//类目ID																			
			Cate_name:'',		//类目名称
			tableData: [],		//一级类目表格数据
			twoTableData: [],	//二级类目表格数据																					
			classOptions:[],	//父类目
			classValue:'',
			//表单显示隐藏
			dialogFormVisible:false,
			//编辑类型
			redactTitle:false,
			//表单数据
			dataForm: {
				name: '',														//类目名称
				icon: '',															//类目图标
				img:'',																//类目图片
				docs: '',															//简介
				grade: '2',															//级别
				children:'',														//子类目
			},
			//验证表单
			rules: {
				name: [{ required: true, message: '类目名称不能为空', trigger: 'blur' }],
			},

		};
    },
	methods: {
		//一级类目编辑信息
	    categoryMsg(id) {
	    	this.dialogFormVisible = true;
			this.redactTitle = false
	    	var data = {
		    		'Cate_id':id
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
	    //二级类目信息
	    twoCategoryMsg(id) {
	    	this.dialogFormVisible = true;
			this.redactTitle = false
	    	var data = {
		    		'Sort_id':id
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
				name: '',														//类目名称
				icon: '',															//类目图标
				img:'',																//类目图片
				docs: '',															//简介
				grade: '2',															//级别
				children:'',	
			}
		},
		//查询列表
		getList(){
			classifyList().then(function(res){
				if(res.data.code == 0){
					this.tableData = res.data.data.list;
					this.classOptions = res.data.data.list.map(function(v,i){
						var obj = {};
						obj.label = v.Cate_name;
						obj.value = v.Cate_id;
						return obj
					});
					this.tableCount = res.data.data.count
				}
			}.bind(this)).catch(function(err){

			})
		},
		//类目值变化
		categoryValue(v) {
			this.dataForm.grade = v
		},
		//选择一级类目
		parentCategory(v) {
			this.dataForm.Cate_id = v
		},
		//类目图片返回值
		uploadProductUrl(res, file, fileLis) {
			this.dataForm.img = this.Path + res.data[0]
		},
		//类目图标返回值
		uploadIconUrl(res, file, fileLis) {
			console.log(res)
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
	    //删除一级类目
	    deleteData(id) {
	    	var data = {'Cate_id':id}
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
	    //删除二级类目
	    twoDeleteData(id) {
	    	var data = {'Sort_id':id}
	    	this.$confirm('确定删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
	        }).then(() => {
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
				twoDeleteData(data).then(res => {
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
	    //查看二级类目
	    secondData(index) {
	    	if(this.tableData[index].children.length){
	    		this.dialogTableCategoryVisible = true;
		    	this.twoTableData = this.tableData[index].children
	    	}else{
	    		this.$alert('二级类目没有数据', '提示', {
					confirmButtonText: '确定',
					type:'warning',
					callback: action => {
					}
				});
	    	}
	    },
	    //模糊查找
	    grabbleData() {
	    	var data = {
	    		'Cate_id':this.Cate_id,
	    		'Cate_name'	:this.Cate_name
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