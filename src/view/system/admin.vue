<template>
	<div class="app-box" style="width:100%;">
		<div class="app-top">
			<el-input  placeholder="请输入管理员名称" v-model='adminName'	class="input-wt" clearable ></el-input>
			<el-button type="primary" icon="el-icon-search" @click='grabbleData'>查找</el-button>
			<el-button type="primary" icon="el-icon-edit" @click='handleAddClick'>添加</el-button>
			<el-button type="primary" icon="el-icon-download" :loading="downloadLoading" @click='handleDownload'>导出</el-button>
		</div>
		<!-- 表格 -->
		<div class="app-table" >
			<el-table :data="tableData" style="width: 100%;text-align: left;" border>
			    <el-table-column prop="admin_id" label="管理员ID" sortable width='300' ></el-table-column>
			    <el-table-column prop="adminName" label="管理员名称" ></el-table-column>
			    <el-table-column prop="adminPath" label="管理员头像" >
			    	<template slot-scope="scope">
						<img :src="scope.row.adminPath" class="table_img" />
					</template>
			    </el-table-column>			    
			    <el-table-column prop="time_create" label="创建时间" sortable ></el-table-column>
			    <el-table-column prop="address" label="操作" width="150">
					<template slot-scope="scope">
						<el-button size="mini" type='primary' @click="handleRedactClick(scope.row.admin_id)">编辑</el-button>
						<el-button size="mini" type="danger" @click="deleteData(scope.row.admin_id)">删除</el-button>
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
				    <el-form-item label="管理员名称" prop="adminName">
			          	<el-input v-model="dataForm.adminName"></el-input>
			        </el-form-item>
			        </el-form-item>
			        <el-form-item label="密码" prop="password">
			         	<el-input type="password" v-model="dataForm.password" auto-complete="off"></el-input>
			        </el-form-item>
			        <el-form-item label="确认密码" prop="checkPassword">
			          	<el-input type="password" v-model="dataForm.checkPassword" auto-complete="off"></el-input>
			        </el-form-item>        
			        <el-form-item label="管理员头像" prop="adminPath" style='text-align: left;'>
						<template>
							<el-upload style="text-align: left;"
							  :action="Path+'admin/common/fileUploads'"
							  list-type="picture-card"
							  :show-file-list="false"
							  accept=".jpg,.jpeg,.png,.gif" 
							  :on-success="uploadProductUrl">
							  <img :src="dataForm.adminPath" class="avatar" v-if="dataForm.adminPath">
							  <i class="el-icon-plus"></i>
							</el-upload>
						</template>
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
import {fetchList,createData,detailData,updateData,deleteData,grabbleData} from '@/api/admin'
import FileSaver from 'file-saver'
import Path from "@/api/path"
import XLSX from 'xlsx'
export default {
	inject: ['reload'],
	name: 'Admin',
	data() {
		//验证密码
		var validatePass = (rule, value, callback) => {
			let regular = /^(?![0-9]+$)[?=a-zA-Z0-9\.,!@#$%^&*()_+|{}?><\-\]\\[\/]{6,}$/;
			if (!regular.test(value.trim())) {
			  callback(new Error('密码格式不对或长度不小于6'))
			}else if (value === '') {
			callback(new Error('请输入密码'))
			} else {
				// if (this.dataForm.checkPassword !== '') {
				//   this.$refs.dataForm.validateField('checkPassword')
				// }
				callback()
			}
		}
		//验证确认密码
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'))
			} else if (value !== this.dataForm.password) {
				callback(new Error('两次输入密码不一致!'))
			} else {
				callback()
			}
		}
		return {
			Path:Path,
			downloadLoading:false,
			redactTitle:false,																						//编辑标题
			adminName: '',																							
				// 表格数据
			tableData: [],
			tableCount:0,																									//表格总条数
			//查询请求参数
			listQuery: {
			'page': 1,
			'rows': 10
			},
			//表单数据
			dataForm: {
				admin_id: undefined,												//管理员id
				adminName: '',														//管理员名称
				password: undefined,												//密码
				checkPassword: undefined,
				adminPath: 0,														//管理员头像
			},
			//验证表单
			rules: {
				adminName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
				password: [
					{ required: true, message: '密码不能为空', trigger: 'blur' },
					{ validator: validatePass, trigger: 'blur' }
				],
				checkPassword: [
					{ required: true, message: '确认密码不能为空', trigger: 'blur' },
					{ validator: validatePass2, trigger: 'blur' }
				],
			},
			// 表单显示隐藏
			dialogFormVisible: false,
		};
    },
	methods: {
		//商品图片返回值
		uploadProductUrl(res, file, fileLis) {
			this.dataForm.adminPath = this.Path + res.data[0]
		},
		//编辑的选择
		handleRedactClick(id) {
		this.dialogFormVisible = true;
		this.redactTitle = false
		this.detailData(id)
		},
		//新建选择
		handleAddClick(){
			this.dialogFormVisible = true;
			this.redactTitle = true
			//初始化
            this.dataForm = {
		        admin_id: undefined,												//管理员id
				adminName: '',														//管理员名称
				password: undefined,												//密码
				checkPassword: undefined,
				adminPath: 0,														//管理员头像
		      }
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
		// 新建
		createData() {
		  this.$refs['dataForm'].validate((valid) => {
		    if (valid) {
		      createData(this.dataForm).then(res => {
		      	if(res.data.code == 0){
		            this.tableData.unshift(res.data.data)
		            this.tableCount +=1;
		            this.dialogFormVisible = false
		            //初始化
					this.dataForm = {
						admin_id: undefined,												//管理员id
						adminName: '',														//管理员名称
						password: undefined,												//密码
						checkPassword: undefined,
						adminPath: 0,														//管理员头像
					},
					      //提示
		            this.$notify({
		              title: '成功',
		              message: '创建成功',
		              type: 'success',
		              duration: 2000
		            })
		          }
		      })
		    }
		  })
		},
	    //更新
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
	    //删除
	    deleteData(id) {
	    	var data = {'admin_id':id}
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
	    //详情
	    detailData(id) {
	    	var data = {
	    		'admin_id':id
	    	}
	    	detailData(data).then(function(res){
	    		if(res.data.code === 0){
	    			this.dataForm = res.data.data
	    		}
	    	}.bind(this))
	    },
	    //模糊查找
	    grabbleData() {
	    	var data = {
	    		'adminName':this.adminName,
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
				const tHeader = ['管理员ID', '管理员名称', '管理员头像', '创建时间']
				const filterVal = ['admin_id', 'adminName', 'adminPath', 'time_create']
				const list = this.tableData;
				const data = this.formatJson(filterVal, list);
				export_json_to_excel(tHeader, data, '管理员信息');
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
.avatar{
	width: 146px;
	height: 146px;
}
.table_img{
	width:60px;
	margin: 0 auto;
	display:block;
}
</style>