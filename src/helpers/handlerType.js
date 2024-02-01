import { msgType } from '@/utils/constants'

/**
 * 处理消息类型
 * @param {string} type      消息类型
 * @returns
 */
export function handlerMsgType(type) {
	switch (type) {
		case 1:
			return msgType.TEXT
		case 2:
			return msgType.AUDIO
		case 3:
			return msgType.IMAGE
		default:
			return msgType.TEXT
	}
}
