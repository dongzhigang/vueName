<template>
	<div class="">
		<el-menu default-active="1"
        class="el-menu-vertical-demo app-menu"
        background-color="#304156"
        text-color="rgb(191, 203, 217)"
        active-text-color="#409eff"
        :collapse="$store.state.app.hasSwitch">
        <el-menu-item index='1' @click="handRouter" >
            <i class="el-icon-ump-yemian"></i>
            <span>首页</span>
        </el-menu-item>
        <el-submenu :index='item.index' v-for="(item,key) in this.$store.state.app.switchRouter" v-bind:key="item.index">
          <template slot='title'>
            <i class="el-icon-menu"></i>
            <span>{{item.title}}</span>
          </template>
          <router-link :to="col.path" class="app-a" v-for="col in item.children" v-bind:key="col.index">
            <el-menu-item :index="col.index">{{col.meta.title}}</el-menu-item>
          </router-link>
        </el-submenu>
      </el-menu>
	</div>
</template>
<script>
	export default {
		name: 'SwitchView',
		data () {
      return {
        
      }
    },
    methods: {
      // handleOpen (key, keyPath) {
      //   console.log(key, keyPath)
      // },
      // handleClose (key, keyPath) {
      //   console.log(key, keyPath)
      // },
      // handleSelect (key, keyPath){
      //   console.log(key, keyPath)
      // },
      handRouter (){
        this.$router.push('/')
      }
    },
    /**
     * 生命周期
     */
    mounted: function () {
      console.log(this.$store.state.app.switchRouter)
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