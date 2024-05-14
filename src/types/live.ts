export interface CreateRoomOption {
	recipient: string | number
	/** 是否群聊 */
	isGroup: boolean
	/** 成员 */
	members?: Array<any>
	/** 开启摄音频 */
	audio?: boolean
	/** 开启摄像头 */
	video?: boolean
}

export interface RoomConnectionInfo {
	token: string
	url: string
}
