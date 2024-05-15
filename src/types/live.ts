import { LocalTrack, RemoteTrack } from 'livekit-client'

export interface CreateRoomOption {
	/** 是否群聊 */
	isGroup: boolean
	/** 聊天对象（非群聊有效） */
	recipient: string | number
	/** 成员（群聊有效） */
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

export interface RoomParticipant {
	vedioTrack?: LocalTrack | RemoteTrack
	audioTrack?: LocalTrack | RemoteTrack
	userInfo?: any
}
