import { create } from 'zustand'
import { encryptMessage, cretateNonce, importKey, performKeyExchange, decryptMessageWithKey } from '@/utils/tweetnacl'
import { getPublicKeyApi } from '@/api/user'
import commonService from '@/db/common'
import userService from '@/db'
import { msgStatus, sendState, chatType, isBurn } from '@/utils/constants'
import { handlerMsgType } from '@/helpers/handlerType'
import {
	sendToUser,
	sendToGroup,
	editGroupMsgApi,
	editUserMsgApi,
	labelMsgApi,
	labelGroupMsgApi,
	setReadApi,
	setGroupReadApi
} from '@/api/msg'
import { addOrUpdateMsg, updateChat } from '@/helpers/messages'
const getPublicKey = async (user_id, friend_id) => {
	const user = await commonService.findOneById(commonService.TABLES.HISTORY, user_id)
	const reslut = await getPublicKeyApi({ user_id: friend_id })

	if (reslut?.code !== 200) return

	const json = JSON.parse(reslut?.data?.secret_bundle)
	const publicKey = importKey(json.publicKey)
	const shareKey = performKeyExchange(user?.data?.keyPair?.privateKey, publicKey)

	// 存储到本地
	const friend = await userService.findOneById(userService.TABLES.FRIENDS_LIST, friend_id, 'user_id')
	friend
		? await userService.update(
				userService.TABLES.FRIENDS_LIST,
				friend_id,
				{
					...friend,
					publicKey,
					shareKey
				},
				'user_id'
			)
		: await userService.add(userService.TABLES.FRIENDS_LIST, { user_id: friend_id, publicKey, shareKey })

	return shareKey
}

/**
 * 发送私聊消息
 * @param {*} type 			消息类型·
 * @param {*} content 		消息内容
 * @param {*} options 		消息选项
 * @param {*} get 			获取
 * @param {*} set 			设置
 * @returns
 */
const sendFriendMessage = async (type, content, options, get, set) => {
	let msg = {}
	let encrypted = ''
	let {
		receiver_id,
		dialog_id,
		is_update = true,
		replay_id = null,
		user_id,
		msg_read_destroy = isBurn.TRUE
	} = options
	let { shareKey } = get()

	try {
		if (!shareKey) {
			const user = await userService.findOneById(userService.TABLES.FRIENDS_LIST, receiver_id, 'user_id')
			shareKey = user?.shareKey ? user?.shareKey : await getPublicKey(user_id, receiver_id)
		}

		// 加密消息
		encrypted = encryptMessage(content, cretateNonce(), shareKey)

		msg = {
			msg_read_status: msgStatus.READ, // 已读（已读、未读）
			msg_type: handlerMsgType(type), // 消息类型
			msg_content: content, // 加密后的消息
			msg_id: Date.now(), // 消息唯一标识，发送成功后会返回
			msg_send_time: Date.now(), // 发送时间
			msg_is_self: true, // 是否是自己发送
			msg_sender_id: user_id, // 发送者 id
			dialog_id, // 会话 id
			msg_send_state: sendState.LOADING, // 发送状态 (发送中、发送成功、发送失败)
			replay_msg_id: replay_id || null, // 回复消息 id，回复功能需要带上，如果不是回复则不需要
			is_marked: false, // 是否标记
			msg_read_destroy
		}

		// 更新当前列表，让发送数据展示在页面
		is_update && set((state) => ({ message: [...state.message, { ...msg }] }))

		// 发送消息
		const { code, data } = await sendToUser({
			content: encrypted,
			dialog_id: parseInt(msg.dialog_id),
			receiver_id,
			replay_id,
			type: msg.msg_type,
			is_burn_after_reading: msg_read_destroy
		})
		// 修改消息状态
		msg.msg_send_state = code === 200 ? sendState.OK : sendState.ERROR
		// 修改消息 id
		msg.msg_id = data.msg_id
	} catch {
		// 如果发送失败就修改消息状态
		msg.msg_send_state = sendState.ERROR
	} finally {
		addOrUpdateMsg(msg.msg_id, { ...msg, msg_content: encrypted }, chatType.PRIVATE)
	}
	return { ...msg, encrypted }
}

/**
 * 发送群聊消息
 * TODO：加密群聊消息
 * @param {*} type 			消息类型·
 * @param {*} content 		消息内容
 * @param {*} options 		消息选项
 * @param {*} get 			获取
 * @param {*} set 			设置
 * @returns
 */
const sendGroupMessage = async (type, content, options, get, set) => {
	let msg = {}
	let encrypted = content
	let { group_id, dialog_id, is_update = true, replay_id = null, user_id, msg_read_destroy = isBurn.TRUE } = options
	try {
		msg = {
			msg_id: Date.now(), // 消息唯一标识，发送成功后会返回
			msg_is_self: true, // 是否是自己发送
			msg_read_status: msgStatus.READ, // 已读（已读、未读）
			msg_type: type, // 消息类型
			msg_content: content, // 发送的消息
			msg_send_time: Date.now(), // 发送时间
			msg_sender_id: user_id, // 发送者 id
			group_id, // 群聊 id
			dialog_id, // 会话 id
			msg_send_state: sendState.LOADING, //	发送状态 (发送中、发送成功、发送失败)
			replay_msg_id: replay_id || null, // 回复消息 id，回复功能需要带上，如果不是回复则不需要
			is_marked: false, // 是否标记
			msg_read_destroy // 是否阅后即焚
		}

		// 更新当前列表，让发送数据展示在页面
		is_update && set((state) => ({ message: [...state.message, { ...msg }] }))

		const { code, data } = await sendToGroup({
			content: msg.msg_content,
			dialog_id: msg.dialog_id,
			group_id: msg.group_id,
			type: msg.msg_type,
			replay_id: replay_id || null,
			is_burn_after_reading: msg_read_destroy
		})
		// 更新消息状态
		msg.msg_send_state = code === 200 ? sendState.OK : sendState.ERROR
		// 更新消息 id
		msg.msg_id = data.msg_id
	} catch {
		// 更新消息状态
		msg.msg_send_state = sendState.ERROR
	} finally {
		addOrUpdateMsg(msg.msg_id, { ...msg, msg_content: encrypted }, chatType.GROUP)
	}
	return { ...msg, encrypted }
}

/**
 * 编辑私聊消息
 * @param {*} type 			消息类型·
 * @param {*} content 		消息内容
 * @param {*} options 		消息选项
 * @param {*} get 			获取
 * @param {*} set 			设置
 * @returns
 */
const editFriendMessage = async (type, content, options, get, set) => {
	let msg = {}
	let { shareKey, message } = get()
	let encrypted = content
	let { msg_id, receiver_id, user_id } = options
	try {
		if (!shareKey) {
			const user = await userService.findOneById(userService.TABLES.FRIENDS_LIST, receiver_id, 'user_id')
			shareKey = user?.shareKey ? user?.shareKey : await getPublicKey(user_id, receiver_id)
			set({ shareKey })
		}

		msg = message.find((item) => item.msg_id === msg_id)
		encrypted = encryptMessage(content, cretateNonce(), shareKey)

		msg.msg_content = content
		msg.msg_send_state = sendState.LOADING

		set({ message: [...message.slice(0, -1), msg] })

		const { code } = await editUserMsgApi({ content: encrypted, msg_id, msg_type: type })
		msg.msg_send_state = code === 200 ? sendState.OK : sendState.ERROR
	} catch {
		// 更新消息状态
		msg.msg_send_state = sendState.ERROR
	} finally {
		addOrUpdateMsg(msg.msg_id, { ...msg, msg_content: encrypted }, chatType.PRIVATE, true)
	}
	return { ...msg, encrypted }
}

/**
 * 编辑群聊消息
 * @param {*} type 			消息类型·
 * @param {*} content 		消息内容
 * @param {*} options 		消息选项
 * @param {*} get 			获取
 * @param {*} set 			设置
 * @returns
 */
const editGroupMessage = async (type, content, options, get, set) => {
	let msg = {}
	let { message } = get()
	let encrypted = content
	let { msg_id } = options
	try {
		msg = message.find((item) => item.msg_id === msg_id)
		msg.msg_content = content
		msg.msg_send_state = sendState.LOADING

		set({ message: [...message.slice(0, -1), msg] })

		const { code } = await editGroupMsgApi({ content: encrypted, msg_id, msg_type: type })
		msg.msg_send_state = code === 200 ? sendState.OK : sendState.ERROR
	} catch {
		// 更新消息状态
		msg.msg_send_state = sendState.ERROR
	} finally {
		addOrUpdateMsg(msg.msg_id, { ...msg, msg_content: encrypted }, chatType.GROUP, true)
	}
	return { ...msg, encrypted }
}

const messageStore = (set, get) => ({
	message: [],
	all_meesage: [],
	shareKey: null,
	clearMessage: () => set({ message: [] }),
	/**
	 * 发送一条消息。
	 *
	 * @param {number} type     -消息类型参数的描述     1 = 文本消息    2 = 语音消息    3 = 图片消息
	 * @param {object} msg      -消息内容对象
	 * @param {object} options  -选项参数的描述
	 * @param {object} options.is_update                    -是否更新消息列表 message， 默认 true
	 * @param {object} options.is_group                     -是否是群聊. 默认 false
	 * @param {object} options.dialog_id                   	-会话 id
	 * @param {object} options.user_id                     	-用户 id
	 * @param {object} options.replay_id                   	-回复 id (如果是回复就必须要穿)
	 * @param {object} options.receiver_id                 	-接收者 id
	 * @param {object} options.group_id                     -群聊 id (如果是群聊就必须要传)
	 *
	 */
	sendMessage: async (type = 1, content, options) => {
		const { is_update = true, is_group = false } = options || {}
		const message = is_group
			? await sendGroupMessage(type, content, options, get, set)
			: await sendFriendMessage(type, content, options, get, set)
		// 是否需要更新消息列表,删除最后一个元素，添加最新的消息
		is_update && set((state) => ({ message: [...state.message.slice(0, -1), message] }))
		updateChat({ ...message, content: message.encrypted })
	},
	/**
	 * 编辑消息
	 *
	 */
	editMessage: async (type = 1, content, options) => {
		const { is_group = false } = options || {}
		const message = is_group
			? await editGroupMessage(type, content, options, get, set)
			: await editFriendMessage(type, content, options, get, set)
		// 是否需要更新消息列表,删除最后一个元素，添加最新的消息
		set((state) => ({ message: [...state.message.slice(0, -1), message] }))
		const { message: msgs } = get()
		const lastMsg = msgs.at(-1)
		// 如果是最后一条消息就更新会话
		lastMsg.msg_id === options.msg_id && updateChat({ ...message, content: message.encrypted })
	},
	/**
	 * 初始化私聊消息
	 * @param {Array<object>} msgs -消息列表
	 * @param {number} id          -好友 id
	 * @param {number} user_id     -用户 id
	 */
	initFriendMessage: async (msgs, user_id, friend_id) => {
		try {
			let { shareKey } = get()

			if (!msgs) return

			if (!shareKey) {
				const user = await userService.findOneById(userService.TABLES.FRIENDS_LIST, friend_id, 'user_id')
				shareKey = user?.shareKey ? user?.shareKey : await getPublicKey(user_id, friend_id)
			}

			// 取最后 30 条
			const msgsList = msgs.slice(-30)
			// 更新消息列表
			for (let index = 0; index < msgsList.length; index++) {
				const item = msgsList[index]
				item.msg_content = decryptMessageWithKey(item.msg_content, shareKey)
			}

			set({ message: msgsList, all_meesage: msgs })
		} catch (error) {
			console.log('初始化错误', error)
		}
	},
	/**
	 * 初始化群聊消息
	 * @param {Array<object>} msgs -消息列表
	 * @param {number} id          -群聊 id
	 * @param {number} user_id     -用户 id
	 * @param {number} group_id    -群聊 id
	 * @param {number} user_id     -用户 id
	 */
	initGroupMessage: async (msgs, user_id) => {
		console.log('初始化群聊消息', msgs, user_id)
		try {
			// 取最后 30 条
			const msgsList = msgs.slice(-30)

			set({ message: msgsList, all_meesage: msgs })
		} catch (error) {
			console.log('初始化错误', error)
		}
	},
	/**
	 * 删除消息
	 * @param {object} msg			消息
	 * @param {boolean} is_group 	是否是群聊
	 * @returns
	 */
	deleteMessage: async (msg, is_group = false) => {
		let flag = true
		try {
			const tableName = is_group ? userService.TABLES.GROUP_MSGS : userService.TABLES.USER_MSGS
			const reslut = await userService.delete(tableName, msg.msg_id, 'msg_id')
			if (!reslut) return false

			// 删除消息
			const { message } = get()
			set({ message: message.filter((item) => item.msg_id !== msg.msg_id) })
		} catch {
			flag = false
		}
		return flag
	},
	/**
	 * 标注消息
	 * @param {object} msg 			消息
	 * @param {boolean} is_marked 	是否标记
	 * @param {boolean} is_group 	是否是群聊
	 * @returns
	 */
	markMessage: async (msg, is_marked = true, is_group = false) => {
		let flag = true
		try {
			const params = { msg_id: msg.msg_id, is_label: is_marked ? 1 : 0 }
			const { code } = is_group ? await labelGroupMsgApi(params) : await labelMsgApi(params)
			if (code !== 200) return false

			const tableName = is_group ? userService.TABLES.GROUP_MSGS : userService.TABLES.USER_MSGS

			const reslut = await userService.findOneById(tableName, msg.msg_id, 'msg_id')
			if (!reslut) return false

			const updateMsg = { ...reslut, is_marked }

			const success = await userService.update(tableName, msg.msg_id, updateMsg, 'msg_id')
			if (!success) return false

			const { message } = get()
			set({
				message: message.map((item) =>
					item.msg_id === msg.msg_id ? { ...updateMsg, msg_content: item.msg_content } : item
				)
			})
		} catch (error) {
			console.log('标记消息错误', error)
			flag = false
		}
		return flag
	},
	/**
	 * 更新消息
	 * @param {Array} msgs			消息
	 * @returns
	 */
	updateMessage: async (msgs) => {
		try {
			let { message, shareKey, updateShareKey } = get()
			const lastMsg = msgs.at(-1)

			// TODO: 后续需要加多一个设备判断，如果是同一台设备就不需要更新
			if (lastMsg.msg_is_self) return

			if (!shareKey) {
				const user = await userService.findOneById(
					userService.TABLES.FRIENDS_LIST,
					lastMsg.msg_sender_id,
					'user_id'
				)
				shareKey = user?.shareKey ? user?.shareKey : await getPublicKey(lastMsg.user_id, lastMsg.friend_id)
				updateShareKey(shareKey)
			}
			lastMsg.msg_content = decryptMessageWithKey(lastMsg.msg_content, shareKey)
			set({ message: [...message, lastMsg] })
		} catch (error) {
			console.log('更新消息错误', error)
		}
	},
	/**
	 * 已读消息
	 * @param {*} key
	 * @returns
	 */
	readMessage: async (dialog_id, is_group = false) => {
		try {
			const tableName = is_group ? userService.TABLES.GROUP_MSGS : userService.TABLES.USER_MSGS
			const reslut = await userService.findOneAll(tableName, 'dialog_id', dialog_id)
			if (!reslut) return

			// 找到未读消息索引
			const index = reslut.findIndex((item) => item.msg_read_status === msgStatus.NOT_READ)
			if (index === -1) return

			const arr = []
			// 更新消息阅读状态
			for (let i = index; i < reslut.length; i++) {
				const item = reslut[i]
				arr.push(item.msg_id)
				await userService.update(tableName, item.msg_id, { msg_read_status: msgStatus.READ }, 'msg_id')
			}

			const params = { msg_ids: arr, dialog_id }
			const { code } = is_group ? await setGroupReadApi(params) : await setReadApi(params)
			if (code !== 200) return

			const { message } = get()

			set({
				message: message.map((item) =>
					item.msg_id === dialog_id ? { ...item, msg_read_status: msgStatus.READ } : item
				)
			})
		} catch (error) {
			console.log('设置已读消息错误', error)
		}
	},
	updateShareKey: (key) => set({ shareKey: key })
})

export const useMessageStore = create(messageStore)
