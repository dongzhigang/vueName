<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view v-if='isRouterAlive' />
  </div>
</template>

<script>
export default {
  name: 'App',
  //provide/inject
  provide (){
    return {
      reload: this.reload
    }
  },
  data (){
    return {
      isRouterAlive:true
    }
  },
  methods: {
    reload (){
      this.isRouterAlive = false
      this.$nextTick(function(){
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
*{
  padding: 0;
  margin: 0;
}
body{
  width: 100%;
  height: 100%;
}
</style>
