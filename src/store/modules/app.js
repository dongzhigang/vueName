import { asyncRouterMap, constantRouterMap } from '@/router'
const app = {
	state: {
		hasSwitch:false,
		switchRouter:asyncRouterMap,
		editorContent:'',											//富文本内容
		editorContentPath:[],										//富文本图片路径
	},
	mutations: {
		SwitchView (state){
			state.hasSwitch = state.hasSwitch?true:false
		},
	},
	getters: {
		SwitchView (state){
			return !state.hasSwitch
		},
	}
}
export default app