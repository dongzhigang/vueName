<template>
	<div class="tagsview">
		<router-link ref='tag' v-for="tag in Array.from(visitedViews)" 
			:to="tag.path" :key="tag.path"  class="tags-view-item"  @contextmenu.prevent.native="openMenu(tag,$event)"
			:class="isActive(tag)?'active':''">
			{{tag.title}}
			<span class='el-icon-close tags-view-span' @click.prevent.stop="closeSelectedTag(tag)"></span>
		</router-link>
		<ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">
			<li @click="closeSelectedTag(selectedTag)">关闭</li>
			<li @click="closeOthersTags">关闭其它</li>
			<li @click="closeAllTags">关闭所有</li>
		</ul>
	</div>
</template>
<script>
export default {
	name: 'TagsView',
	data() {
		return {
			visible:false,				//右击冒泡出现隐藏
			selectedTag:{},				//右击选中路径对象
			left:0,
			top:0
		}
	},
	methods:{
		//判断当前路径
		isActive(route){
		  return route.path === this.$route.path || route.name === this.$route.name
		},
		//路径标签
		addViewTags(){//路由改变时执行的方法
	      if(this.$route.name){
	        const route = this.$route
	         this.$store.dispatch('addVisitedViews',route);
	      }
	    },
	    //关闭
		closeSelectedTag(view){//先提交删除数据的方法,数组删除出掉数据后，如果关闭的是当前打开的路由需要将路由改为数组最后一次push进去的路由
			this.$store.dispatch('delVisitedViews',view).then((views)=>{
				if(this.isActive(view)){//只有在关闭当前打开的标签页才会有影响
					let lastView = views.slice(-1)[0]//选取路由数组中的最后一位
					if(lastView){
						this.$router.push(lastView);
					}else{
						this.$router.push('/');
					}
				}
			})
		},
		//关闭其他
		closeOthersTags() {
			this.$router.push(this.selectedTag.path)
			this.$store.dispatch('delOthersViews',this.selectedTag)
		},
		//关闭所有
		closeAllTags() {
			this.$router.push('/')
			this.$store.dispatch('delAllViews',this.selectedTag)
		},
		//鼠标右击
		openMenu(tag, e) {
			this.visible = true
			this.selectedTag = tag
			this.left = e.layerX
			this.top = e.layerY
		},
		//点击body
		closeMenu() {
	      this.visible = false
	    },
	},
	computed:{
		visitedViews(){//store中取值
			return this.$store.state.tagsview.visitedviews
		}
	},
	//监听动态
	watch:{
		//路径
		$route(){
		  this.addViewTags();
		},
		//属性
		visible(value){
			if(value){
				document.body.addEventListener('click', this.closeMenu)
			}else {
				document.body.removeEventListener('click', this.closeMenu)
			}
		}
	},
	/**
	 * 生命周期
	 * @return {[type]} [description]
	 */
	mounted() {
		this.addViewTags()
	},
}
</script>
<style scoped>
	.tagsview{
		padding-left: 20px;
		position: relative;
	}
	.tags-view-item{
		margin-right: 5px;
		text-decoration: none;
		color: #495060;
		border:solid 1px #d8dce5;
		font-size: 12px;
		padding:0 10px;
		line-height: 26px;
		height: 26px;
		display: inline-block;
		background: #fff;
	}
	.tagsview .active{
		background-color: #42b983;
	    color: #fff;
	    border-color: #42b983;
	}
	.tags-view-span{
	    width: 16px;
	    height: 16px;
	    line-height: 1;
	    vertical-align: 2px;
	    border-radius: 50%;
	    text-align: center;
	    transition: all .3s cubic-bezier(.645,.045,.355,1);
	    transform-origin: 100% 50%;
	    font-size: normal;
	    font-family: element-icons!important;
	}
	.tags-view-span:hover{
		background: #b4bccc;
		color: #fff;
	}
	.tags-view-span:before{
		transform: scale(.6);
	    display: inline-block;
	    content: "\E60F";
	    vertical-align: -3px;
	}
	.contextmenu{
		width: 80px;
		margin: 0;
		background: #fff;
		z-index: 2;
		position: absolute;
		list-style-type: none;
		padding: 5px 0;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 400;
		color: #333;
		box-shadow: 2px 2px 3px 0 rgba(0,0,0,.3);
		text-align: left;
	}
	.contextmenu li{
		margin: 0;
	    padding: 7px 16px;
	    cursor: pointer;
	}
</style>