import type { groupListParams } from '@/types/api/group'
import request from '@/utils/request'

class GroupService {
	private baseUrl: string = '/group'
	private baseGroupUrl: string = '/relation/group'

	/**
	 * 获取群申请列表
	 * @param {*} params
	 * @returns
	 */
	groupRequestListApi(params: groupListParams): Promise<DataResponse> {
		return request({
			url: `${this.baseGroupUrl}/request_list`,
			params
		})
	}
}

export default new GroupService()
