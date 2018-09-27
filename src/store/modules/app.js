import { asyncRouterMap, constantRouterMap } from '@/router'
const app = {
	state: {
		hasSwitch:false,
		switchRouter:asyncRouterMap,
	},
	mutations: {
		SwitchView (state){
			state.hasSwitch = state.hasSwitch?true:false
		},
	},
	getters: {
		SwitchView (state){
			return !state.hasSwitch
		}
	}
}
export default app