import request from '@/utils/request'

class CallServiceImpl {
	private liveUser: string = '/live/user'
	private liveGroup: string = '/live/group'

	/**
	 * 创建通话
	 * @param {*} data
	 * @param {*} data.user_id
	 * @returns
	 */
	createLiveUserApi(data?: any): Promise<DataResponse> {
		return request({
			url: this.liveUser + '/create',
			method: 'POST',
			data
		})
	}

	/**
	 * 创建群聊通话
	 * @param {*} data
	 * @param {*} data.user_id
	 * @returns
	 */
	createLiveGroupApi(data?: any): Promise<DataResponse> {
		return request({
			url: this.liveGroup + '/create',
			method: 'POST',
			data
		})
	}

	/**
	 * 加入通话
	 * @param data
	 * @returns
	 */
	joinLiveUserApi(data?: any): Promise<DataResponse> {
		return request({
			url: this.liveUser + '/join',
			method: 'POST',
			data
		})
	}

	/**
	 * 加入群聊通话
	 * @param data
	 * @returns
	 */
	joinLiveGroupApi(data?: any): Promise<DataResponse> {
		return request({
			url: this.liveGroup + '/join',
			method: 'POST',
			data
		})
	}

	/**
	 * 结束通话
	 * @param data
	 * @returns
	 */
	leaveLiveUserApi(data?: any): Promise<DataResponse> {
		return request({
			url: this.liveUser + '/leave',
			method: 'POST',
			data
		})
	}

	/**
	 * 结束群聊通话
	 * @param data
	 * @returns
	 */
	leaveLiveGroupApi(data?: any): Promise<DataResponse> {
		return request({
			url: this.liveGroup + '/leave',
			method: 'POST',
			data
		})
	}

	/**
	 * 拒绝通话
	 * @param data
	 * @returns
	 */
	rejectLiveUserApi(data?: any): Promise<DataResponse> {
		return request({
			url: this.liveUser + '/reject',
			method: 'POST',
			data
		})
	}

	/**
	 * 拒绝群聊通话
	 * @param data
	 * @returns
	 */
	rejectLiveGroupApi(data?: any): Promise<DataResponse> {
		return request({
			url: this.liveGroup + '/reject',
			method: 'POST',
			data
		})
	}

	/**
	 * 获取通话信息
	 * @param params
	 * @returns
	 */
	getLiveInfoUserApi(params: any): Promise<DataResponse> {
		return request({
			url: this.liveUser + '/show',
			method: 'GET',
			params
		})
	}

	/**
	 * 获取群聊通话信息
	 * @param params
	 * @returns
	 */
	getLiveInfoGroupApi(params: any): Promise<DataResponse> {
		return request({
			url: this.liveGroup + '/show',
			method: 'GET',
			params
		})
	}
}

const CallService = new CallServiceImpl()

export default CallService
