import { create } from 'zustand'
// import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { encryptMessage, cretateNonce, importKey, performKeyExchange } from '@/utils/tweetnacl'
import { getPublicKeyApi } from '@/api/user'
import commonService from '@/db/common'

const getPublicKey = async (user_id,friend_id) => {
    const user = await commonService.findOneById(commonService.TABLES.HISTORY, user_id)
	const reslut = await getPublicKeyApi({ user_id: friend_id })
	if (reslut?.code !== 200) return
	const json = JSON.parse(reslut?.data?.secret_bundle)
	const publicKey = importKey(json.publicKey)
	const sharedKey = performKeyExchange(user.privateKey, publicKey)
	return sharedKey
}

// 发送私聊消息
const sendFriendMessage = async (type, msg, options) => {
	let message = ''
	try {
		if (options?.shareKey) {
			// TODO: 获取对方公钥
		}

		const nonce = cretateNonce()
		const encrypted = encryptMessage(msg?.meg_content, nonce, options?.shareKey)
	} catch (error) {}
	return message
}

//  发送群聊消息
const sendGroupMessage = async (type, msg, options) => {
	let message = ''
	return message
}

const messageStore = (set) => ({
	message: [],
	updateMessage: (message) => set((state) => ({ message: [...state.message, message] })),
	clearMessage: () => set({ message: [] }),
	/**
	 * 发送一条消息。
	 *
	 * @param {number} type     -消息类型参数的描述     1 = 文本消息    2 = 语音消息    3 = 图片消息
	 * @param {object} msg      -消息内容对象
	 * @param {object} options  -选项参数的描述
	 * @param {object} options.is_update                    -是否更新消息列表 message， 默认 true
	 * @param {object} options.is_group                     -是否是群聊. 默认 false
	 */
	sendMessage: async (type, msg, options) => {
		const { is_update = true, is_group = false } = options || {}
		const message = is_group
			? await sendGroupMessage(type, msg, options)
			: await sendFriendMessage(type, msg, options)
		// 是否需要更新消息列表
		is_update && set((state) => ({ message: [...state.message, message] }))
	}
})

export const useUserStore = create(messageStore)
