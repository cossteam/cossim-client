import request from '@/utils/request'

// const baseApi = '/group'
const relationGroup = '/relation/group'

export function groupRequestListApi(params) {
	return request({
		url: relationGroup + '/request_list',
		method: 'GET',
		params
	})
}
