<template>
	<div class="tagsview">
		<el-tag class="tagsview-item" :key="tag.index" v-for="tag in tags" closable :disable-transitions="false">
			{{tag.name}}
		</el-tag>
	</div>
</template>
<script>
	export default {
		name: 'TagsView',
    data() {
      return {
        tags: [
						{ name: '标签一', path: '' },
						{ name: '标签二', path: 'success' },
						{ name: '标签三', path: 'info' },
						{ name: '标签四', path: 'warning' },
						{ name: '标签五', path: 'danger' }
        ]
      }
    }
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