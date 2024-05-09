import type {
	LoginData,
	PublicKeyData,
	RegisterData,
	SearchUserParams,
	UpdateUserInfData,
	UserInfoParams,
	updatePassWorData,
	LogoutData
} from '@/types/api/user'
import request from '@/utils/request'

class UserServiceImpl {
	private baseUrl: string = '/user'

	/**
	 * 使用提供的数据发送登录请求。
	 *
	 * @param {LoginData} data
	 * @return {Promise<DataResponse>}
	 */
	loginApi(data: LoginData): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/login`,
			method: 'post',
			data
		})
	}

	/**
	 * 注册接口
	 *
	 * @param {RegisterData} data
	 * @returns {Promise<DataResponse>}
	 */
	registerApi(data: RegisterData): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/register`,
			method: 'post',
			data
		})
	}

	/**
	 * 上传公钥到服务器
	 * @param {PublicKeyData} data
	 * @returns {Promise<DataResponse>}
	 */
	uploadPublicKeyApi(data: PublicKeyData): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/bundle/modify`,
			method: 'POST',
			data
		})
	}

	// setPgpKeyApi(data) {
	// 	return request({
	// 		url: `${baseApi}/key/set`,
	// 		method: 'post',
	// 		data
	// 	})
	// }

	// /**
	//  * 交换E2EKey
	//  * @param {*} data
	//  * @param {*} data.public_key
	//  * @param {*} data.user_id
	//  * @returns
	//  */
	// switchE2EKey(data) {
	// 	return request({
	// 		url: `${baseApi}/switch/e2e/key`,
	// 		method: 'POST',
	// 		data
	// 	})
	// }

	/**
	 * 搜索用户
	 * @param {*} params
	 * @param {*} params.email
	 * @returns
	 */
	searchUserApi(params: SearchUserParams): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/search`,
			params
		})
	}

	/**
	 * 查询用户信息
	 * @param {*} params
	 * @param {string} params.user_id     	用户 邮箱 | id
	 * @returns
	 */
	getUserInfoApi(params: UserInfoParams): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/info`,
			method: 'get',
			params
		})
	}

	/**
	 * 修改用户信息
	 * @param {UpdateUserInfData} data
	 * @returns
	 */
	updateUserInfoApi(data: UpdateUserInfData): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/info/modify`,
			method: 'POST',
			data
		})
	}

	/**
	 * 修改密码
	 * @param {*} data
	 * @param {*} data.old_password
	 * @param {*} data.password
	 * @param {*} data.confirm_password
	 * @returns
	 */
	updatePassWordApi(data: updatePassWorData): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/password/modify`,
			method: 'POST',
			data
		})
	}

	/**
	 * 退出登录
	 * @returns
	 */
	logoutApi(data: LogoutData) {
		return request({
			url: `${this.baseUrl}/logout`,
			method: 'POST',
			data
		})
	}

	/**
	 * 修改用户头像
	 * @param {*} data
	 * @param {*} data.file - 用户头像文件
	 * @returns {Promise<DataResponse>}
	 */
	updateAvatarApi(data: { file: File }): Promise<DataResponse> {
		const formData = new FormData()
		formData.append('file', data.file)

		return request({
			url: `${this.baseUrl}/avatar/modify`,
			method: 'POST',
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
	}

	/**
	 * 获取用户的公钥
	 * @param {*} params
	 * @param {*} params.user_id
	 */
	getPublicKeyApi(params: UserInfoParams): Promise<DataResponse> {
		return request({
			url: `${this.baseUrl}/bundle/get`,
			method: 'GET',
			params
		})
	}

	// /**
	//  * 修改自己的公钥
	//  * @param {*} data
	//  * @param {*} data.secret_bundle
	//  * @returns
	//  */
	// updatePublicKeyApi(data) {
	// 	return request({
	// 		url: `${baseApi}/bundle/modify`,
	// 		method: 'POST',
	// 		data
	// 	})
	// }
}

const UserService = new UserServiceImpl()

export default UserService
