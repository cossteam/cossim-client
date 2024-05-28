// // import type {
// // 	LoginData,
// // 	PublicKeyData,
// // 	RegisterData,
// // 	SearchUserParams,
// // 	UpdateUserInfData,
// // 	UserInfoParams,
// // 	updatePassWorData,
// // 	LogoutData
// // } from '@/types/api/user'
// import request from '@/utils/request'

// class UserServiceImpl {
// 	private baseUrl: string = '/user'

// 	/**
// 	 * 使用提供的数据发送登录请求。
// 	 *
// 	 * @param {LoginData} data
// 	 * @return {Promise<ResponseData>}
// 	 */
// 	loginApi(data: LoginData): Promise<ResponseData> {
// 		return request({
// 			url: `${this.baseUrl}/login`,
// 			method: 'POST',
// 			data
// 		})
// 	}

// 	/**
// 	 * 注册接口
// 	 *
// 	 * @param {RegisterData} data
// 	 * @returns {Promise<ResponseData>}
// 	 */
// 	registerApi(data: RegisterData): Promise<ResponseData> {
// 		return request({
// 			url: `${this.baseUrl}/register`,
// 			method: 'POST',
// 			data
// 		})
// 	}

// 	/**
// 	 * 上传公钥到服务器
// 	 * @param {PublicKeyData} data
// 	 * @returns {Promise<ResponseData>}
// 	 */
// 	uploadPublicKeyApi(data: PublicKeyData): Promise<ResponseData> {
// 		return request({
// 			url: `${this.baseUrl}/bundle`,
// 			method: 'PUT',
// 			data
// 		})
// 	}

// 	// setPgpKeyApi(data) {
// 	// 	return request({
// 	// 		url: `${baseApi}/key/set`,
// 	// 		method: 'post',
// 	// 		data
// 	// 	})
// 	// }

// 	// /**
// 	//  * 交换E2EKey
// 	//  * @param {*} data
// 	//  * @param {*} data.public_key
// 	//  * @param {*} data.user_id
// 	//  * @returns
// 	//  */
// 	// switchE2EKey(data) {
// 	// 	return request({
// 	// 		url: `${baseApi}/switch/e2e/key`,
// 	// 		method: 'POST',
// 	// 		data
// 	// 	})
// 	// }

// 	/**
// 	 * 搜索用户
// 	 * @param {*} params
// 	 * @param {*} params.email
// 	 * @returns
// 	 */
// 	searchUserApi(params: SearchUserParams): Promise<ResponseData> {
// 		return request({
// 			url: `${this.baseUrl}/search`,
// 			params
// 		})
// 	}

// 	/**
// 	 * 查询用户信息
// 	 * @param {*} params
// 	 * @param {string} params.user_id     	用户 邮箱 | id
// 	 * @returns
// 	 */
// 	getUserInfoApi(params: UserInfoParams): Promise<ResponseData> {
// 		return request({
// 			url: `${this.baseUrl}/${params.user_id}`,
// 			method: 'GET'
// 			// params
// 		})
// 	}

// 	/**
// 	 * 修改用户信息
// 	 * @param {UpdateUserInfData} data
// 	 * @returns
// 	 */
// 	updateUserInfoApi(data: UpdateUserInfData): Promise<ResponseData> {
// 		return request({
// 			url: `${this.baseUrl}`,
// 			method: 'PUT',
// 			data
// 		})
// 	}

// 	/**
// 	 * 修改密码
// 	 * @param {*} data
// 	 * @param {*} data.old_password
// 	 * @param {*} data.password
// 	 * @param {*} data.confirm_password
// 	 * @returns
// 	 */
// 	updatePassWordApi(data: updatePassWorData): Promise<ResponseData> {
// 		return request({
// 			url: `${this.baseUrl}/password`,
// 			method: 'PUT',
// 			data
// 		})
// 	}

// 	/**
// 	 * 退出登录
// 	 * @returns
// 	 */
// 	logoutApi(data: LogoutData) {
// 		return request({
// 			url: `${this.baseUrl}/logout`,
// 			method: 'POST',
// 			data
// 		})
// 	}

// 	/**
// 	 * 修改用户头像
// 	 * @param {*} data
// 	 * @param {*} data.file - 用户头像文件
// 	 * @returns {Promise<ResponseData>}
// 	 */
// 	updateAvatarApi(data: { file: File }): Promise<ResponseData> {
// 		const formData = new FormData()
// 		formData.append('file', data.file)

// 		return request({
// 			url: `${this.baseUrl}/avatar`,
// 			method: 'PUT',
// 			data: formData,
// 			headers: {
// 				'Content-Type': 'multipart/form-data'
// 			}
// 		})
// 	}

// 	/**
// 	 * 获取用户的公钥
// 	 * @param {*} params
// 	 * @param {*} params.user_id
// 	 */
// 	getPublicKeyApi(params: UserInfoParams): Promise<ResponseData> {
// 		return request({
// 			url: `${this.baseUrl}/${params.user_id}/bundle`,
// 			method: 'GET'
// 			// params
// 		})
// 	}

// 	// /**
// 	//  * 修改自己的公钥
// 	//  * @param {*} data
// 	//  * @param {*} data.secret_bundle
// 	//  * @returns
// 	//  */
// 	// updatePublicKeyApi(data) {
// 	// 	return request({
// 	// 		url: `${baseApi}/bundle/modify`,
// 	// 		method: 'POST',
// 	// 		data
// 	// 	})
// 	// }
// }

// const UserService = new UserServiceImpl()

// export default UserService
