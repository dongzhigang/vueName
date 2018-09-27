<template>
	<div class="app-box" style="width:100%;">
		<div class="app-top">
			<el-input  placeholder="请输入用户名" v-model='userName'	class="input-wt" clearable @change='nameChange'></el-input>
			<el-input  placeholder="请输入手机号码" v-model='mobile' 	class="input-wt" clearable @change='mobileChange'></el-input>
			<el-button type="primary" icon="el-icon-search" @click='grabbleData'>查找</el-button>
			<el-button type="primary" icon="el-icon-edit" @click='handleAddClick'>添加</el-button>
			<el-button type="primary" icon="el-icon-download" :loading="downloadLoading" @click='handleDownload'>导出</el-button>
		</div>
		<!-- 表格 -->
		<div class="app-table" >
			<el-table :data="tableData" style="width: 100%;text-align: left;" border>
			    <el-table-column prop="user_id" label="用户ID" sortable width='300' ></el-table-column>
			    <el-table-column prop="userName" label="用户名" ></el-table-column>
			    <el-table-column prop="nickName" label="呢称" ></el-table-column>
			    <el-table-column prop="mobile" label="手机号码" ></el-table-column>
			    <el-table-column prop="sex" label="性别"  >
					<template slot-scope="scope">
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium">{{ scope.row.sex }}</el-tag>
						</div>
					</template>
			    </el-table-column>
			    <el-table-column prop="birthday" label="出生日期" ></el-table-column>
			    <el-table-column prop="userLevel" label="用户等级" >
					<template slot-scope="scope">
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium">{{ scope.row.userLevel }}</el-tag>
						</div>
					</template>
			    </el-table-column>
			    <el-table-column prop="state" label="状态" >
					<template slot-scope="scope">
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium">{{ scope.row.state }}</el-tag>
						</div>
					</template>
			    </el-table-column>
			    <el-table-column prop="time_create" label="创建时间" ></el-table-column>
			    <el-table-column prop="address" label="操作" width="150">
					<template slot-scope="scope">
						<el-button size="mini" type='primary' @click="handleRedactClick(scope.row.user_id)">编辑</el-button>
						<el-button size="mini" type="danger" @click="deleteData(scope.row.user_id)">删除</el-button>
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
				    <el-form-item label="用户名" prop="userName">
			          	<el-input v-model="dataForm.userName"></el-input>
			        </el-form-item>
			        <el-form-item label="呢称" prop="nickName">
			          	<el-input v-model="dataForm.nickName"></el-input>
			        </el-form-item>
			        <el-form-item label="手机号码" prop="mobile">
			          	<el-input v-model="dataForm.mobile"></el-input>
			        </el-form-item>
			        <el-form-item label="密码" prop="password">
			         	<el-input type="password" v-model="dataForm.password" auto-complete="off"></el-input>
			        </el-form-item>
			        <el-form-item label="确认密码" prop="checkPassword">
			          	<el-input type="password" v-model="dataForm.checkPassword" auto-complete="off"></el-input>
			        </el-form-item>        
			        <el-form-item label="性别" prop="sex" style='text-align: left;'>
						<el-select v-model="dataForm.sex" >
							<el-option label="未知" :value="0">
							</el-option>
							<el-option label="女" :value="1">
							</el-option>
							<el-option label="男" :value="2">
							</el-option>
						</el-select>
			        </el-form-item>
			        <el-form-item label="生日" prop="birthday" style='text-align: left;'>
						<el-date-picker v-model="dataForm.birthday" type="date" value-format="yyyy-MM-dd">
						</el-date-picker>
			        </el-form-item>
			        <el-form-item label="用户等级" prop="userLevel" style='text-align: left;'>
						<el-select v-model="dataForm.userLevel">
							<el-option label="普通用户" :value="0">
							</el-option>
							<el-option label="VIP用户" :value="1">
							</el-option>
							<el-option label="高级VIP用户" :value="2">
							</el-option>
						</el-select>
			        </el-form-item>            
			        <el-form-item label="状态" prop="state" style='text-align: left;'>
						<el-select v-model="dataForm.state">
							<el-option label="可用" :value="0">
							</el-option>
							<el-option label="禁用" :value="1">
							</el-option>
							<el-option label="注销" :value="2">
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
import {fetchList,createData,detailData,updateData,deleteData,grabbleData} from '@/api/user'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
	inject: ['reload'],
	name: 'User',
	data() {
		//验证密码
		var validatePass = (rule, value, callback) => {
			let regular = /^(?![0-9]+$)[?=a-zA-Z0-9\.,!@#$%^&*()_+|{}?><\-\]\\[\/]{6,}$/;
			if (!regular.test(value.trim())) {
			  callback(new Error('密码格式不对或长度不小于6'))
			}else if (value === '') {
			callback(new Error('请输入密码'))
			} else {
				if (this.dataForm.checkPassword !== '') {
				  this.$refs.dataForm.validateField('checkPassword')
				}
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
		//验证手机
		var validateMobile = (rule, value, callback) => {
		var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;            
		if (!myreg.test(value.trim())) {               
			callback(new Error('请输入有效11位手机号码'))            
		} else {                
			callback()           
		}
		}
		return {
			downloadLoading:false,
			redactTitle:false,																						//编辑标题
			userName: '',																									//用户名
			mobile:'',
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
				user_id: undefined,													//用户id
				userName: '',														//用户名
				mobile: '',															//手机号码
				sex:0,																//性别
				password: undefined,												//密码
				checkPassword: undefined,
				userLevel: 0,														//用户等级
				birthday: undefined,												//出生日期
				state: 0															//用户状态
			},
			//验证表单
			rules: {
				userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
				mobile: [
					{ required: true, message: '手机号码不能为空', trigger: 'blur' },
					{	validator: validateMobile, trigger: 'blur' }
				],
				password: [
					{ required: true, message: '密码不能为空', trigger: 'blur' },
					{ validator: validatePass, trigger: 'blur' }
				],
				checkPassword: [
					{ required: true, message: '确认密码不能为空', trigger: 'blur' },
					{ validator: validatePass2, trigger: 'blur' }
				],
				birthday: [{ required: true, message: '日期不能为空', trigger: 'blur' }]
			},
			// 表单显示隐藏
			dialogFormVisible: false,
		};
    },
	methods: {
		//获取用户名
		nameChange(val) {
			console.log(val)
			this.userName = val
		},
		//获取手机号码
		mobileChange(val) {
			console.log(val)
			this.mobile = val
		},
		//选中 input 中的文字
		handleSelect(item) {
		this.tableData= [item]
		this.tableCount = 1
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
					        user_id: undefined,													//用户id
					        userName: '',																//用户名
					        mobile: '',																	//手机号码
					        sex:0,																			//性别
					        password: undefined,												//密码
					        checkPassword: undefined,
					        userLevel: 0,																//用户等级
					        birthday: undefined,												//出生日期
					        state: 0																		//用户状态
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
		            // this.$router.go(0)
		            //刷新组件
		            this.reload()
		          }
	          })
	        }
	      })
	    },
	    //删除
	    deleteData(id) {
	    	var data = {'user_id':id}
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
	    		'user_id':id
	    	}
	    	detailData(data).then(function(res){
	    		if(res.data.code === 0){
	    			this.dataForm = res.data.data
	    			this.dataForm.checkPassword = this.dataForm.password
	    		}
	    	}.bind(this))
	    },
	    //模糊查找
	    grabbleData() {
	    	var data = {
	    		'userName':this.userName,
	    		'mobile'	:this.mobile
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
				export_json_to_excel(tHeader, data, '用户信息');
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