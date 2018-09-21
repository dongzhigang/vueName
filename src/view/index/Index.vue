<template>
  <div class="app-wrapper">
    <el-container style="height: 100%;">
      <!-- <el-menu default-active="1"
        class="el-menu-vertical-demo app-menu"
        background-color="#304156"
        text-color="rgb(191, 203, 217)"
        active-text-color="#409eff"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse">
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
      </el-menu> -->
      <SwitchView></SwitchView>
      <el-container>
        <el-header class='app-head'>
          <navbar></navbar>
        </el-header>
        <el-header class='app-head'>
          <TagsView></TagsView>
        </el-header>
        <el-main>
          <AppMain></AppMain>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import Navbar from './Navbar'
  import AppMain from './AppMain'
  import TagsView from './TagsView'
  import SwitchView from './SwitchView'
  export default {
    name: 'Index',
    data () {
      return {

      }
    },
    components: {
      Navbar,
      AppMain,
      TagsView,
      SwitchView
    },
    methods: {
     
    },
  }
</script>
<style scoped>
  .app-wrapper{
    height: 100%;
    width: 100%;
    position: absolute;
  }
  .app-head{
    padding: 0;
    display: flex;
    align-items:center;
    border-bottom: solid 1px #e6e6e6;
    height: 50px !important;
  }
</style>
