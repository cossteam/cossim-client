import type {
    LoginParams,
    LogoutParams,
    PassWordUpdateParams,
    PublicKeyParams,
    RegisterParams,
    SearchUserParams,
    UserInfUpdateParams,
    UserInfoQueryParams,
    UserPublicKeyQueryParams
} from '@/types/api'
import request from '@/utils/request'

const baseUrl: string = '/user'

/**
 * 登录接口
 * @param data
 * @returns
 */
export function loginApi(data: LoginParams): Promise<ResponseData> {
    return request({
        url: `${baseUrl}/login`,
        method: 'POST',
        data
    })
}

/**
 * 注册接口
 * @param data
 * @param data.nickname - 用户名
 * @param data.email - 邮箱
 * @param data.password - 密码
 * @param data.confirm_password - 确认密码
 * @param data.public_key - 公钥
 * @returns
 */
export function registerApi(data: RegisterParams): Promise<ResponseData> {
    return request({
        url: `${baseUrl}/register`,
        method: 'POST',
        data
    })
}

/**
 * 修改用户密钥包（消息加密）
 * @param data
 * @returns
 */
export function uploadPublicKeyApi(data: PublicKeyParams): Promise<ResponseData> {
    return request({
        url: `${baseUrl}/bundle`,
        method: 'PUT',
        data
    })
}

/**
 * 搜索用户
 * @param params
 * @returns
 */
export function searchUserApi(params: SearchUserParams): Promise<ResponseData> {
    return request({
        url: `${baseUrl}/search`,
        method: 'GET',
        params
    })
}

/**
 * 查询用户信息
 * @param params
 * @returns
 */
export function getUserInfoApi(params: UserInfoQueryParams): Promise<ResponseData> {
    return request({
        url: `${baseUrl}/${params.id}`,
        method: 'GET',
        params
    })
}

/**
 * 修改用户信息
 * @param data
 * @returns
 */
export function updateUserInfoApi(data: UserInfUpdateParams): Promise<ResponseData> {
    return request({
        url: `${baseUrl}`,
        method: 'PUT',
        data
    })
}

/**
 * 修改密码
 * @param data
 * @returns
 */
export function updatePassWordApi(data: PassWordUpdateParams): Promise<ResponseData> {
    return request({
        url: `${baseUrl}/password`,
        method: 'PUT',
        data
    })
}

/**
 * 退出登录
 * @returns
 */
export function logoutApi(data: LogoutParams): Promise<ResponseData> {
    return request({
        url: `${baseUrl}/logout`,
        method: 'POST',
        data
    })
}

/**
 * 修改用户头像
 * @param {*} data.file - 用户头像文件
 * @returns {Promise<ResponseData>}
 */
export function updateAvatarApi(data: { file: File }): Promise<ResponseData> {
    const formData = new FormData()
    formData.append('file', data.file)
    return request({
        url: `${baseUrl}/avatar`,
        method: 'PUT',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

/**
 * 获取用户的公钥
 * @param params
 * @returns
 */
export function getPublicKeyApi(params: UserPublicKeyQueryParams): Promise<ResponseData> {
    return request({
        url: `${baseUrl}/${params.user_id}/bundle`,
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
// export function updatePublicKeyApi(data) {
// 	return request({
// 		url: `${baseApi}/bundle/modify`,
// 		method: 'POST',
// 		data
// 	})
// }
