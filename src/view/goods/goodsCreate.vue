<template>
	<div class="app-container" style="width: 100%;box-sizing: border-box; text-align: left;">
		<!-- <el-form ref="form" :rules="rules"  :model="dataForm" label-width="150px"> -->
			<div class="box-card">
				<div class="el-card__body">
					<h3>商品介绍</h3>
					<el-form ref="dataForm" :rules="rules"  :model="dataForm" label-width="150px">
						<el-form-item label="商品编号" prop="number"  >
							<el-input v-model="dataForm.number"></el-input>
						</el-form-item>
						<el-form-item label="商品名称" prop="name"  >
							<el-input v-model="dataForm.name"></el-input>
						</el-form-item>
						<el-form-item label="专柜价格" prop="shop_price">
							<el-input placeholder="0.00" v-model.number="dataForm.shop_price" >
								<template slot="append">元</template>
							</el-input>
						</el-form-item>
						<el-form-item label="当前价格" prop="at_price">
							<el-input placeholder="0.00" v-model.number="dataForm.at_price">
								<template slot="append">元</template>
							</el-input>
						</el-form-item>
						<el-form-item label="是否新品" style="text-align: left;">
							<template>
							  <el-radio v-model="dataForm.new_product" label="1">新品</el-radio>
							  <el-radio v-model="dataForm.new_product" label="0">非新品</el-radio>
							</template>
						</el-form-item>
						<el-form-item label="是否热卖" style="text-align: left;">
							<template>
							  <el-radio v-model="dataForm.hot_sale" label="1">热卖</el-radio>
							  <el-radio v-model="dataForm.hot_sale" label="0">普通</el-radio>
							</template>
						</el-form-item>
						<el-form-item label="是否在售" style="text-align: left;">
							<template>
							  <el-radio v-model="dataForm.sell" label="1">在售</el-radio>
							  <el-radio v-model="dataForm.sell" label="0">未售</el-radio>
							</template>
						</el-form-item>
						<el-form-item label="商品图片"  >
							<template>
								<el-upload style="text-align: left;"
								  :action="Path+'admin/common/fileUploads'"
								  list-type="picture-card"
								  :show-file-list="false"
								  accept=".jpg,.jpeg,.png,.gif" 
								  :on-success="uploadProductUrl">
								  <img :src="dataForm.img" class="avatar" v-if="dataForm.img">
								  <i class="el-icon-plus"></i>
								</el-upload>
							</template>
						</el-form-item>
						<el-form-item label="宣传画廊"  >
							<template>
								<el-upload style="text-align: left;"
								  :action="Path+'admin/common/fileUploads'"
								  list-type="picture-card"
								  accept=".jpg,.jpeg,.png,.gif"
  								  :on-remove="handleRemove"
								  :on-success="uploadMasterUrl">
								  <i class="el-icon-plus"></i>
								</el-upload>
							</template>
						</el-form-item>
						<el-form-item label="商品编号"  >
							<el-input placeholder="件 / 个 /盒" v-model="dataForm.unit"></el-input>
						</el-form-item>
						<el-form-item label="关键词" style="text-align: left;" >
							<el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
								{{tag}}
							</el-tag>
							<el-input
								class="input-new-tag"
								v-if="inputVisible"
								v-model="inputValue"
								ref="saveTagInput"
								size="small"
								@keyup.enter.native="handleInputConfirm"
								@blur="handleInputConfirm"
								style='width: 100px;'
							>
							</el-input>
							<el-button v-else class="button-new-tag" size="small" type="primary" @click="showInput">+增加</el-button>
						</el-form-item>
						<el-form-item label="所属分类" style='text-align: left;' >
							<el-cascader
								:options="classOptions"
								@change="handleChange">
							</el-cascader>
						</el-form-item>
						<el-form-item label="所属品牌" style='text-align: left;z-index: 2;background: #fff;' >
							<template>
								<el-select v-model="dataForm.brand_id" placeholder="请选择">
									<el-option
									v-for="item in brandsOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value">
									</el-option>
								</el-select>
							</template>
						</el-form-item>
						<el-form-item label="商品简介"  >
							<el-input v-model="dataForm.docs"></el-input>
						</el-form-item>
						<el-form-item label="商品详情"  >
							 <!-- 组件有两个属性 value 传入内容双向绑定 setting传入配置信息 -->           
							 <editor></editor>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<!-- //商品规格 -->
			<div class="box-card">
				<div class="el-card__body">
					<h3>商品规格</h3>
					<el-row>
						<el-col :xs="10" :sm="10" :md="10" :lg="10">
							<div class="el-radio-group">
								<span class="el-radio-button" :class="{active:!addSpeci}" @click="handSelectSpec">默认标准规格</span>
								<span class="el-radio-button" :class="{active:addSpeci}" @click="handSelectSpec">多规格支持</span>
							</div>
						</el-col>
						<el-col :xs="10" :sm="10" :md="10" :lg="10"  >
							<div class="el-radio-group">
								<el-button type="primary" size="small" plain v-if="addSpeci" @click="dialogFormVisible=true">添加</el-button>
							</div>
						</el-col>
					</el-row>
					<!-- 默认标准规格 -->
					<el-table :data="tableSpeciData" style="width: 100%" v-if="!addSpeci">
						<el-table-column prop="name" label="规格名" >
						</el-table-column>
						<el-table-column prop="value" label="规格值" >
							<template slot-scope="scope">
								<el-tag type="primary" disable-transitions>{{scope.row.value}}</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="img" label="规格图片">
							<template slot-scope="scope">
								<img :src="scope.row.img" v-if='scope.row.img' class="avatar-icon">
							</template>
						</el-table-column>
						<el-table-column label="操作" >
							<template slot-scope="scope">
								<el-button type="danger" size="mini"  disable-transitions @click="speciDel(scope.$index,scope.row)">删除</el-button>
							</template>
						</el-table-column>
				    </el-table>
				   <!--  多规格支持 -->
				    <el-table :data="tableSpeciData" style="width: 100%" v-else>
						<el-table-column prop="name" label="规格名" >
						</el-table-column>
						<el-table-column prop="value" label="规格值" >
							<template slot-scope="scope">
								<el-tag type="primary" disable-transitions>{{scope.row.value}}</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="img" label="规格图片">
							<template slot-scope="scope">
								<img :src="scope.row.img" v-if='scope.row.img' class="avatar-icon">
							</template>
						</el-table-column>
						<el-table-column label="操作" >
							<template slot-scope="scope">
								<el-button type="danger" size="mini"  disable-transitions @click="speciDel(scope.$index,scope.row)">删除</el-button>
							</template>
						</el-table-column>
				    </el-table>
				    <!-- 规格编辑 -->
				    <el-dialog title="设置规格" :visible.sync="dialogFormVisible">
						<el-form :model="speciForm" style='width: 400px; margin-left: 50px; ' label-width="100px" label-position="left" >
							<el-form-item label="规格名" style='text-align: left;' >
								<el-input v-model="speciForm.name" ></el-input>
							</el-form-item>
							<el-form-item label="规格值" >
								<el-input v-model="speciForm.value" ></el-input>
							</el-form-item>
							<el-form-item label="规格图片" >
								<template >
									<el-upload style="text-align: left;"
									  :action="Path+'admin/common/fileUploads'"
									  list-type="picture-card"
									  :show-file-list="false"
									  accept=".jpg,.jpeg,.png,.gif" 
									  :on-success="uploadSpeciUrl">
									  <img :src="speciImg" class="avatar" v-if="speciImg">
									  <i class="el-icon-plus"></i>
									</el-upload>
								</template>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="dialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="speciRefer">确 定</el-button>
						</div>
					</el-dialog>
				</div>
			</div>
			<!-- 商品库存 -->
			<div class="box-card">
				<div class="el-card__body">
					<h3>商品库存</h3>
					<!-- 默认标准库存 -->
					<el-table :data="tableSkuData" style="width: 100%" v-if="!addSpeci">
						<el-table-column prop="name" label="货品规格" >
							<template slot-scope="scope">
								<el-tag type="primary" disable-transitions>{{scope.row.name}}</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="selling_price" label="货品售价" ></el-table-column>
						<el-table-column prop="count" label="货品数量"></el-table-column>
						<el-table-column prop="img" label="货品图片">
							<template slot-scope="scope">
								<img :src="scope.row.img" v-if="scope.row.img" class="avatar-icon">
							</template>
						</el-table-column>
						<el-table-column label="操作" >
							<template slot-scope="scope">
								<el-button type="primary" size="mini" @click="skuSet(scope.$index,scope.row)" >设置</el-button>
							</template>
						</el-table-column>
				    </el-table>
				    <!-- 多规格库存支持 -->
				    <el-table :data="tableSkuData" style="width: 100%" v-else>
						<el-table-column prop="name" label="货品规格" >
							<template slot-scope="scope">
								<el-tag type="primary" disable-transitions>{{scope.row.name}}</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="selling_price" label="货品售价" ></el-table-column>
						<el-table-column prop="count" label="货品数量"></el-table-column>
						<el-table-column prop="img" label="货品图片">
							<template slot-scope="scope">
								<img :src="scope.row.img" v-if="scope.row.img" class="avatar-icon">
							</template>
						</el-table-column>
						<el-table-column label="操作" >
							<template slot-scope="scope">
								<el-button type="primary" size="mini" @click="skuSet(scope.$index,scope.row)" >设置</el-button>
							</template>
						</el-table-column>
				    </el-table>
				    <!-- 库存编辑 -->
				    <el-dialog title="设置货品" :visible.sync="dialogFormSkuVisible">
						<el-form :model="skuForm" style='width: 400px; margin-left: 50px; ' label-width="100px" label-position="left" >
							<el-form-item label="货品规格" style='text-align: left;' >
								<template >
									<el-tag type="primary" disable-transitions>{{skuForm.name}}</el-tag>
								</template>
							</el-form-item>
							<el-form-item label="货品售价" >
								<el-input v-model="skuForm.selling_price" ></el-input>
							</el-form-item>
							<el-form-item label="货品数量" >
								<el-input v-model="skuForm.count" ></el-input>
							</el-form-item>
							<el-form-item label="货品图片" >
								<template>
									<el-upload style="text-align: left;"
									  :action="Path+'admin/common/fileUploads'"
									  list-type="picture-card"
									  :show-file-list="false"
									  accept=".jpg,.jpeg,.png,.gif" 
									  :on-success="uploadSkuUrl">
									  <img :src="skuImg" class="avatar" v-if="skuImg">
									  <i class="el-icon-plus"></i>
									</el-upload>
								</template>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="dialogFormSkuVisible = false">取 消</el-button>
							<el-button type="primary" @click="skuRefer">确 定</el-button>
						</div>
					</el-dialog>
				</div>
			</div>
			<!-- 商品参数 -->
			<div class="box-card">
				<div class="el-card__body">
					<h3>商品参数</h3>
					<el-button type="primary" size="small" plain  @click="dialogParameterFormVisible=true">添加</el-button>
					<el-table :data="tableParameterData" style="width: 100%">
						<el-table-column prop="name" label="商品参数名称" ></el-table-column>
						<el-table-column prop="value" label="商品参数值" ></el-table-column>
						<el-table-column label="操作" >
							<template slot-scope="scope">
								<el-button type="danger" size="mini"  disable-transitions @click="parameterDel(scope.$index,scope.row)">删除</el-button>
							</template>
						</el-table-column>
				    </el-table>
				    <!-- 参数编辑 -->
				    <el-dialog title="设置商品参数" :visible.sync="dialogParameterFormVisible">
						<el-form :model="parameterForm" style='width: 400px; margin-left: 50px; ' label-width="100px" label-position="left" >
							<el-form-item label="商品参数名称" style='text-align: left;' >
								<template >
									<el-input v-model="parameterForm.name" ></el-input>
								</template>
							</el-form-item>
							<el-form-item label="商品参数值" >
								<el-input v-model="parameterForm.value" ></el-input>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="dialogParameterFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="parameterRefer">确 定</el-button>
						</div>
					</el-dialog>
				</div>
			</div>
			<el-button @click="handleCancel">取消</el-button>
	  		<el-button type="primary" @click="handlePutaway">上架</el-button>
	</div>
</template>
<script>
	import Editor from "@/components/editor"
	import Path from "@/api/path"
	import {classList,brandList,createData}	from '@/api/goods'
	export default {
		naem: 'GoodsCreate',
		data (){
			return {
				Path:Path,
				//商品宣传图路径
				MasterImg:[],
				//类目数据
				classOptions:[],
				//品牌数据
		        brandsOptions: [],
		        //规格添加出现隐藏
		        addSpeci:false,
		        //规格数据
		        tableSpeciData:[
			        {
			        	name:'规格',
			        	value:'标准',
			        	img:""
			        }
		        ],
		        dialogFormVisible:false,
		        dialogFormSkuVisible:false,
		        dialogParameterFormVisible:false,
		        //规格表单数据
		        speciForm:{
		        	name:'',
		        	name_id:'',
		        	value:'',
		        	value_id:'',
		        	img:'',
		        },
		        speciImg:'',
		        //库存表单数据
		        skuForm:{},
		        skuImg:'',
		        skuIndex:0,
		        //库存数据
		        tableSkuData:[
		        	{
		        		name:'标准',
			        	selling_price:0,
			        	count:0,
			        	img:'',
		        	}
		        ],
		        //商品参数数据
		        tableParameterData:[],
		        //商品参数表单
		        parameterForm: {},

				//表单数据
				dataForm: {
					number:'',								//商品编号
					name:'',								//商品名称
					shop_price:'',							//专柜价格（原价）
					at_price:'',							//当前价格
					docs:'',								//商品简介
					unit:'',								//商品單位
					img:'',									//商品缩略图
					master:'',								//商品宣传图
					antistop:'',							//关键词
					Cate_id:'',								//一类目id
					Sort_id:'',								//二类目id
					brand_id:'',							//品牌id
					new_product:'0',						//新品
					hot_sale:'0',							//热卖
					sell:'0',								//在售
					speci:'',								//商品规格
					sku:'',									//商品库存
					parameter:[],							//商品参数
					contents:'',							//商品详情内容
					contentsPath:[],						//商品详情图片路径
				},
				//关键词数据
				dynamicTags: [],
				//关键词输入框是否显示
		    	inputVisible: false,
		    	//关键词值
		        inputValue: '',

		        //验证表单
		        rules: {
		        	number: [{required: true, message: '商品编号不能为空', trigger: 'blur'}],
		        	name: [{required: true, message: '商品编号不能为空', trigger: 'blur'}],
		        	shop_price: [
		        		{required: true, message: '专柜价格不能为空', trigger: 'blur'},
		        		{ type: 'number', message: '专柜价格必须为数字值'}
		        	],
		        	at_price: [
		        		{required: true, message: '当前价格不能为空', trigger: 'blur'},
		        		{ type: 'number', message: '当前价格必须为数字值'}
		        	]
		        }
			}
		},
		//使用组件
		components: {
		//使用编辑器
		  editor:Editor
		},
		methods: {
			//删除关键词
			handleClose(tag) {
				this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
			},
			//添加关键词
			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			//提交关键词
			handleInputConfirm() {
				let inputValue = this.inputValue;
				if (inputValue) {
					this.dynamicTags.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = '';
			},
			//类目列表
			handClassList() {
				classList().then(function(res){
					if(res.data.code ===0 ){
						let data = res.data.data.list
						data.forEach(function(v,i){
							v.label = v.Cate_name
							v.value = v.Cate_id
							v.children.map(function(v,i){
								v.label = v.Sort_name
								v.value = v.Sort_id
							})
						})
						this.classOptions = data
					}
				}.bind(this))
			},
			//获取类目
			handleChange(val) {
				this.dataForm.Cate_id = val[0]
				this.dataForm.Sort_id = val[1]
			},
			//品牌列表
			handBrandList() {
				brandList().then(function(res){
					if(res.data.code ===0 ){
						let data = res.data.data.list
						data.forEach(function(v,i){
							v.label = v.brand_name
							v.value = v.id
						})
						this.brandsOptions = data
					}
				}.bind(this))
			},
			//规格选择
			handSelectSpec (){
				this.addSpeci = !this.addSpeci
				if(this.addSpeci){
					this.tableSpeciData = []
					this.tableSkuData = []
				}else{
					this.tableSpeciData=[{name:'规格',value:'标准',img:""}]
					this.tableSkuData = [{name:'标准',selling_price:0,count:0,img:'',}]
				}
			},
			//规格图片上传
			uploadSpeciUrl (res, file, fileLis){
				this.speciImg = this.Path + res.data[0]
				this.speciForm.img = this.Path + res.data[0]
			},
			//规格表单提交
			speciRefer (){
				this.speciForm.img = this.speciImg
				this.tableSpeciData.push(this.speciForm)
				this.dialogFormVisible = false
				let obj = {name:this.speciForm.value,selling_price:0,count:0,img:'',}
				this.tableSkuData.push(obj)
				this.skuForm.name = this.speciForm.value
				this.speciForm = {name:'',name_id:'',value:'',value_id:'',img:'',}
				this.speciImg = ""
			},
			//规格删除
			speciDel (index,row){
				this.tableSpeciData.splice(index,1)
				this.tableSkuData.splice(index,1)
			},
			//库存图片上传
			uploadSkuUrl (res, file, fileLis){
				this.skuImg = this.Path + res.data[0]
				this.skuForm.img = this.Path + res.data[0]
			},
			//设置库存
			skuSet (index,row){
				this.skuForm = row
				this.dialogFormSkuVisible = true
				this.skuIndex = index
			},
			//库存表单修改
			skuRefer (){
				this.dialogFormSkuVisible = false
				this.tableSkuData[this.skuIndex] = this.skuForm
			},
			//商品参数设置
			parameterRefer (){
				this.tableParameterData.push(this.parameterForm)
				this.dialogParameterFormVisible = false
			},
			//商品参数删除
			parameterDel (index){
				this.tableParameterData.splice(index,1)
			},
			//删除宣传图
			handleRemove(file, fileList) {
				var path = file.response.data[0]
				this.dataForm.master.map(function(v,i,arr){
					if(v.indexOf(path)>-1){
						arr.splice(i,1)
					}
				})
			},
			handlePictureCardPreview(file) {
				console.log(file);
			},
			//商品图片返回值
			uploadProductUrl(res, file, fileLis) {
				// this.imgUrl = this.Path +  res.data[0]
				// this.hasImage = true
				this.dataForm.img = this.Path + res.data[0]
			},
			//商品宣传图返回值
			uploadMasterUrl (res, file, fileLis){
				// this.MasterImg.push(this.Path + res.data[0])
				this.dataForm.master.push(this.Path + res.data[0])
			},
			//上架商品
			handlePutaway() {
				this.dataForm.antistop = this.dynamicTags.length?this.dynamicTags:''	//关键词
				this.dataForm.speci = this.tableSpeciData.length?this.tableSpeciData:''									//商品规格
				this.dataForm.sku = this.tableSkuData.length?this.tableSkuData:''										//商品库存
				this.dataForm.parameter = this.tableParameterData.length?this.tableParameterData:''	//商品参数
				this.dataForm.contents = this.$store.state.app.editorContent.length?this.$store.state.app.editorContent:''				//商品详情内容
				this.dataForm.contentsPath = this.$store.state.app.editorContentPath.length?this.$store.state.app.editorContentPath:''		//商品详情图片路径
				console.log(this.dataForm)
				this.$refs['dataForm'].validate((valid) => {
					if (valid) {
						createData(this.dataForm).then(function(res){
							if(res.data.code == 0){
								this.$notify({
					              title: '成功',
					              message: res.data.msg,
					              type: 'success',
					              duration: 2000
					            })
					            //刷新组件
					            this.$router.push('/goods/goodsList')
							}
						}.bind(this))
					} else {
						return false;
					}
				});
			},
			//取消
			handleCancel() {
				this.$router.push('/goods/goodsList')
			}
		},
		/**
		 * 生命那个周期
		 */
		mounted (){
			//类目列表
			this.handClassList();
			//品牌列表
			this.handBrandList();
		}
	}
</script>
<style scoped>
	.app-container{
		padding: 20px;
	}
	.box-card{
		border: 1px solid #ebeef5;
	    background-color: #fff;
	    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
	    color: #303133;
	    margin-bottom: 20px;
	}
	.el-card__body{
		padding: 20px;
		text-align: left;
	}
	.el-card__body h3{
		text-align: left;
		margin-bottom: 10px;
	}
	.box-cardlabel{
		font-weight: 700;
	}
	.el-radio-group{
		border: 1px solid #dcdfe6;
		display: inline-block;
	    line-height: 1;
	    vertical-align: middle;
	    font-size: 0;
	    border-radius: 4px;
	    text-align: left;
	}
	.el-radio-button{
		cursor: pointer;
	    box-shadow: none!important;
	    padding: 10px 20px;
	    font-size: 14px;
	}
	.el-radio-group .active{
		color: #fff;
	    background-color: #409eff;
	    border-color: #409eff;
	    box-shadow: -1px 0 0 0 #409eff;
	}
	.el-radio-group .active2{
		color: #fff;
	    background-color: #409eff;
	    border-color: #409eff;
	    box-shadow: -1px 0 0 0 #409eff;
	}
	.avatar{
		width: 146px;
		height: 146px;
	}
	.avatar-icon{
		width: 40px;
		height: 40px;
	}
</style>