import axios from 'axios'
import path from '@/utils/path'
const service = axios.create({
	baseURL: path(), // api的base_url
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	},
	timeout: 1000 // request timeout
})

export default service
