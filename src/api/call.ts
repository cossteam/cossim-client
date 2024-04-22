import request from '@/utils/request'
import axios from 'axios'

class CallServiceImpl {
	// private liveUser: string = '/live/user'
	// private liveGroup: string = '/live/group'

	private live: string = '/live'

	/**
	 * 创建通话
	 * @param {number} [data.group_id] - 群聊id，仅在通话类型为 "group" 时有效
	 * @param {string[]} data.member - 成员列表，包含用户ID的数组
	 * @param {object} data.option - 通话选项
	 * @param {boolean} data.option.audio_enabled - 是否启用音频
	 * @param {string} data.option.codec - 编解码器
	 * @param {number} data.option.frame_rate - 帧率
	 * @param {string} data.option.resolution - 分辨率
	 * @param {boolean} data.option.video_enabled - 是否启用视频
	 * @param {string} data.type - 通话类型，值为 "user" 或 "group"
	 */
	createLiveApi(data?: any): Promise<DataResponse> {
		return request({
			url: this.live,
			method: 'POST',
			data
		})
	}

	// /**
	//  * 创建群聊通话
	//  * @param {*} data
	//  * @param {*} data.user_id
	//  * @returns
	//  */
	// createLiveGroupApi(data?: any): Promise<DataResponse> {
	// 	return request({
	// 		url: this.live,
	// 		method: 'POST',
	// 		data
	// 	})
	// }

	/**
	 * 加入通话
	 * @param data
	 * @param {string} data.room - 房间id，加入的通话房间
	 * @returns
	 */
	joinLiveApi(data?: any): Promise<DataResponse> {
		return request({
			url: `${this.live}/${data.room}/join`,
			method: 'POST',
			data
		})
	}

	// /**
	//  * 加入群聊通话
	//  * @param data
	//  * @returns
	//  */
	// joinLiveGroupApi(data?: any): Promise<DataResponse> {
	// 	return request({
	// 		url: `${this.live}/${data.room}/join`,
	// 		method: 'POST',
	// 		data
	// 	})
	// }

	/**
	 * 结束通话
	 * @param data
	 * @param {string} data.room - 房间id
	 * @returns
	 */
	leaveLiveApi(data?: any): Promise<DataResponse> {
		return request({
			url: `${this.live}/${data.room}`,
			method: 'DELETE',
			data
		})
	}

	// /**
	//  * 结束群聊通话
	//  * @param data
	//  * @returns
	//  */
	// leaveLiveGroupApi(data?: any): Promise<DataResponse> {
	// 	return request({
	// 		url: this.liveGroup + '/leave',
	// 		method: 'POST',
	// 		data
	// 	})
	// }

	/**
	 * 拒绝通话
	 * @param data
	 * @param {string} data.room - 房间id
	 * @returns
	 */
	rejectLiveApi(data?: any): Promise<DataResponse> {
		return request({
			url: `${this.live}/${data.room}`,
			method: 'DELETE',
			data
		})
	}

	// /**
	//  * 拒绝群聊通话
	//  * @param data
	//  * @returns
	//  */
	// rejectLiveGroupApi(data?: any): Promise<DataResponse> {
	// 	return request({
	// 		url: `${this.live}/${data.room}`,
	// 		method: 'DELETE',
	// 		data
	// 	})
	// }

	/**
	 * 获取用户通话信息
	 * @param params
	 * @returns
	 */
	getLiveInfoUserApi(params: any): Promise<DataResponse> {
		return request({
			url: this.live + '/user',
			method: 'GET',
			params
		})
	}

	/**
	 * 获取群聊通话信息
	 * @param params
	 * @param {number} params.id - 群聊id
	 * @returns
	 */
	getLiveInfoGroupApi(params: any): Promise<DataResponse> {
		return request({
			url: this.live + '/group',
			method: 'GET',
			params
		})
	}

	getLocalRoom(userName: string, roomName: string) {
		return axios.get('http://192.168.100.21:5000/getToken', {
			method: 'GET',
			params: {
				userName,
				roomName
			}
		})
	}
}

const CallService = new CallServiceImpl()

export default CallService
