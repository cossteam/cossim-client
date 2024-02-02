import request from '@/utils/request'

const live = '/live/user'

/**
 * 创建通话
 * @param {*} data
 * @param {*} data.user_id
 * @returns
 */
export function liveUserApi(data) {
	return request({
		url: live + '/create',
		method: 'POST',
		data
	})
}
