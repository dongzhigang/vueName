import Vue from 'vue'
import vuex from 'vuex'
import app from './modules/app'
import tagsview from './modules/tagsview'
import getters from './getters'
import admin from './modules/admin'
Vue.use(vuex);
var store = new vuex.Store({//store对象
    modules: {
    	app,
    	tagsview,
    	admin
    },
    getters
})
export default store