/**
 * 用户登录信息表
 */
export interface UserDataBase {
	/**
	 * 自增 id
	 */
	id?: number
	/**
	 * 用户 id
	 */
	user_id: string
	/**
	 * 账号
	 */
	account: string
	/**
	 * 共享密钥
	 */
	keyPair: { privateKey: Uint8Array; publicKey: Uint8Array }
	/**
	 * 设备 id
	 */
	device_id: string
	/**
	 * 设备信息
	 */
	device_info: any
	/**
	 * 其他信息
	 */
	other_info: any
}
