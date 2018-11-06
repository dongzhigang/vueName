<template>
  <div class="app-wrapper ">
    <el-container style="height: 100%;">
      <SwitchView></SwitchView>
      <el-container class="main-containe" style="height: 100%;">
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
