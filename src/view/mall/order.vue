<template>
	<div class="app-box" style="width:100%;">
		<div class="app-top">
			<el-input  placeholder="请输入用户ID" v-model='user_id'	class="input-wt" clearable ></el-input>
			<el-input  placeholder="请输入订单编号" v-model='order_number' 	class="input-wt" clearable ></el-input>
			<el-button type="primary" icon="el-icon-search" @click='grabbleData'>查找</el-button>
			<el-button type="primary" icon="el-icon-download" :loading="downloadLoading" @click='handleDownload'>导出</el-button>
		</div>
		<!-- 表格 -->
		<div class="app-table" >
			<el-table :data="tableData" style="width: 100%;text-align: left;" border >
			    <el-table-column label="序号" type="index" width="50"></el-table-column>
			    <el-table-column prop="order_number" label="订单编号" width="270"></el-table-column>
			    <el-table-column prop="user_id" label="用户ID" width="270"></el-table-column>
			    <el-table-column prop="status" label="订单状态" >
			    	<template slot-scope="scope">
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium" type="primary">{{scope.row.status}}</el-tag>
						</div>
					</template>
			    </el-table-column>
			    <el-table-column prop="actualPrice" label="订单金额"></el-table-column>
			    <el-table-column prop="goodsPrice" label="支付金额" ></el-table-column>
			    <el-table-column prop="payment_time" label="支付时间"></el-table-column>
			    <el-table-column prop="shipping_code" label="物流单号" ></el-table-column>
			    <el-table-column prop="shipping_name" label="物流名称"></el-table-column>
			    <el-table-column prop="" label="操作" width="150">
					<template slot-scope="scope">
						<el-button size="mini" type='primary' @click="categoryMsg(scope.$index)">详情</el-button>
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
		<!-- 订单详情 -->
		<div class="app-from">
			<el-dialog title="订单详情" :visible.sync="dialogFormVisible" style='text-align: left;'>
			 	<el-form status-icon :model="orderData" label-position="left" label-width="100px" style=''>
				    <el-form-item label="订单编号">
			          	<span>{{orderData.order_number}}</span>
			        </el-form-item>
			        <el-form-item label="订单状态">
			          	<span>{{orderData.status}}</span>
			        </el-form-item>	
			        <el-form-item label="买家昵称">
			          	<span>{{orderData.buyer_nick}}</span>
			        </el-form-item>	
			        <el-form-item label="收货信息">
			          	<span>（收货人）{{orderData.shipping.name}}</span>
		          		<span>（手机号）{{orderData.shipping.mobile}}</span>
		          		<span>（地址）{{orderData.shipping.address}}</span>
			        </el-form-item>	
			        <el-form-item label="商品信息">
		          		<el-table :data="orderData.goods" border size="small" fit highlight-current-row>
						    <el-table-column prop="title" label="商品名称" ></el-table-column>
						    <el-table-column prop="number" label="商品编号"></el-table-column>
						    <el-table-column prop="property_val" label="货品规格"></el-table-column>
						    <el-table-column prop="price" label="货品价格" ></el-table-column>
						    <el-table-column prop="num" label="货品数量"></el-table-column>
						    <el-table-column prop="pic_path" label="货品图片" >
						    	<template slot-scope="scope">
									<img :src="scope.row.pic_path" class="goods_img">
								</template>
						    </el-table-column>
						 </el-table>
			        </el-form-item>	
			        <el-form-item label="费用信息" prop="docs" width="800">
			          	<span>
		          			（实际费用）{{orderData.actualPrice}} =
		          			（商品总价）{{orderData.goodsPrice}}元 +
		          			（快递费用）0元 -
		          			（优惠减免）0元 -
		          		    （积分减免）0元
		          		</span>
			        </el-form-item>	
			        <el-form-item label="支付信息" prop="docs">
			          	<span>（支付渠道）微信支付</span>
		          		<span>（支付时间）{{orderData.payment_time}}</span>
			        </el-form-item>	
			        <el-form-item label="快递信息" prop="docs">
			          	<span>（快递公司）{{orderData.shipping_name}}</span>
		          		<span>（快递单号）{{orderData.shipping_code}}</span>
		          		<span>（发货时间）{{orderData.consign_time}}</span>
			        </el-form-item>	
			        <el-form-item label="收货信息" prop="docs">
			          	<span>（确认发货时间）{{orderData.confirmTime}}</span>
			        </el-form-item>
				</el-form>
			</el-dialog>
		</div>
	</div>
</template>
<script>
import {orderList,grabbleData} from '@/api/order'
import FileSaver from 'file-saver'
import Path from "@/api/path"
import XLSX from 'xlsx'
export default {
	inject: ['reload'],
	name: 'Order',
	data() {
		return {
			Path:Path,					//域名
			downloadLoading:false,		//导出加载显示隐藏																		
			user_id: '',				//用户ID																			
			order_number:'',			//订单编号
			tableData: [],				//表格数据
			tableCount:0,
			listQuery: {
				'page': 1,
				'rows': 10
			},
			//表单显示隐藏
			dialogFormVisible:false,
			//订单数据
			orderData: {
				shipping:{}
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
	    categoryMsg(index) {
	    	this.dialogFormVisible = true;
	    	this.orderData = this.tableData[index]
	    },
		//查询列表
		getList(){
			orderList(this.listQuery).then(function(res){
				if(res.data.code == 0){
					this.tableData = res.data.data.list;
					console.log(res)
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
	    //模糊查找
	    grabbleData() {
	    	var data = {
	    		'user_id' :this.user_id,
	    		'order_number' :this.order_number
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
				const tHeader = ['订单编号', '用户ID', '订单状态','订单金额','支付金额', '支付时间', '物流单号','物流名称']
				const filterVal = ['order_number', 'user_id', 'status', 'goodsPrice','actualPrice', 'payment_time', 'shipping_code', 'shipping_name']
				const list = this.tableData;
				const data = this.formatJson(filterVal, list);
				export_json_to_excel(tHeader, data, '订单信息');
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
.goods_img{
	width: 50px;
}
</style>