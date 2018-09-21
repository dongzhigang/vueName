<template>
	<div class="">
		<el-menu default-active="1"
        class="el-menu-vertical-demo app-menu"
        background-color="#304156"
        text-color="rgb(191, 203, 217)"
        active-text-color="#409eff"
        @open="handleOpen"
        @close="handleClose"
        :collapse="Collapse">
        <el-menu-item index='1' >
          <i class="el-icon-menu"></i>
          <span>首页</span>
        </el-menu-item>
        <el-submenu index='2' v-for="item in array" v-bind:key="item.index">
          <template slot='title'>
            <i class="el-icon-menu"></i>
            <span>{{item.name}}</span>
          </template>
          <el-menu-item class="app-menu-item" index='2-1' v-for="col in item.children" v-bind:key="col.index">
            <router-link :to="col.path" class="app-a">
              <div class="app-item-text">{{col.title}}</div>
            </router-link>
          </el-menu-item>
        </el-submenu>
      </el-menu>
	</div>
</template>
<script>
	import Bus from '@/assets/bus.js'
	export default {
		name: 'SwitchView',
		data () {
      return {
        array: [
          {
            name: '用户管理',
            children: [
              {
                path: '/user',
                title: '会员管理'
              }
            ]
          }
        ],
        Collapse: true
      }
    },
    mounted: function () {
      var vm = this
      // 用$on事件来接收参数
      Bus.$on('val', (data) => {
        console.log(data)
        vm.Collapse = data
      })
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    },
	}
</script>
<style scoped>
	.app-menu{
    height: 100%;
    background: #304156;
    text-align: left;
    border:none;
  }
  .app-menu-item{
    background:#1f2d3d!important;
  }
  .app-item-text{
    padding-left: 10px;
  }
  .app-a{
    color: #fff;
    text-decoration: none;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .app-aside:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>