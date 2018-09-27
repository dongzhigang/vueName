<template>
	<div class="tagsview">
		<!-- <el-tag class="tagsview-item" :key="tag.index" :type="tag.type" size="small" v-for="tag in tags" closable :disable-transitions="false">
			{{tag.name}}
		</el-tag> -->
		<router-link ref='tag' v-for="tag in Array.from(visitedViews)" 
			:to="tag.path" :key="tag.path"  class="tags-view-item"  @contextmenu.prevent.native="openMenu(tag,$event)"
			:class="isActive(tag)?'active':''">
			{{tag.title}}
			<span class='el-icon-close' @click.prevent.stop="delSelectTag(tag)"></span>
		</router-link>
		<!-- <ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">
		<li @click="closeSelectedTag(selectedTag)">关闭</li>
		<li @click="closeOthersTags">关闭其它</li>
		<li @click="closeAllTags">关闭所有</li>
		</ul> -->
	</div>
</template>
<script>
export default {
	name: 'TagsView',
	data() {
		return {
			tags: [
				{ name: '标签一', type: 'info' },
				{ name: '标签二', type: '' },
				{ name: '标签三', type: 'info' },
				{ name: '标签四', type: 'info' },
				{ name: '标签五', type: 'info' }
			],
			visible:false,
			left:0,
			top:0
		}
	},
	methods:{
		isActive(route){
		  return route.path === this.$route.path || route.name === this.$route.name
		},
		addViewTags(){//路由改变时执行的方法
			console.log(this.visitedViews)
	      if(this.$route.name){
	        const route = this.$route
	         this.$store.dispatch('addVisitedViews',route);
	      }
	    },
		delSelectTag(view){//先提交删除数据的方法,数组删除出掉数据后，如果关闭的是当前打开的路由需要将路由改为数组最后一次push进去的路由
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
		openMenu(tag, e) {
			this.visible = true
			this.selectedTag = tag
			this.left = e.clientX
			this.top = e.clientY
		},
	},
	computed:{
		visitedViews(){//store中取值
			return this.$store.state.tagsview.visitedviews
		}
	},
	watch:{
		$route(){
		  this.addViewTags();
		}
	},
	mounted() {
	    this.addViewTags()
	  },
}
</script>
<style scoped>
	.tagsview{
		padding-left: 20px;
	}
	.tagsview-item{
		margin-right: 10px;
	}
</style>