import React, { useState, useEffect } from 'react'
import { Page } from 'framework7-react'
import MessageBox from '@/components/Message/Chat'
import MsgBar from '@/components/Message/MsgBar'
import { ArrowLeftIcon, MoreIcon } from '@/components/Icon/Icon'
import { useUserStore } from '@/stores/user'
import PropType from 'prop-types'
// import { $t } from '@/i18n'
import { msgStatus, msgType, sendState } from '@/utils/constants'
import { groupInfoApi, groupMemberApi } from '@/api/group'
import { sendToGroup } from '@/api/msg'
import userService from '@/db'
import { f7 } from 'framework7-react'
import { useLiveQuery } from 'dexie-react-hooks'

GroupChat.propTypes = {
	f7route: PropType.object.isRequired,
	f7router: PropType.object.isRequired
}
export default function GroupChat({ f7route, f7router }) {
	// 用户信息
	const { user } = useUserStore()
	// 群号ID
	const groupId = f7route.params.id
	// 会话ID
	const dialogId = f7route.query.dialog_id
	// 群信息
	const [groupInfo, setGroupInfo] = useState({})
	// 群成员信息
	const [members, setMembers] = useState([])
	// 页面显示消息列表
	const msgList =
		useLiveQuery(() => userService.findOneAll(userService.TABLES.GROUP_MSGS, 'group_id', parseInt(groupId))) || []
	const [messages, setMessages] = useState([])
	// 是否首次进入
	const [isActive, setIsActive] = useState(true)

	useEffect(() => {
		// 只截取最新的 30 条消息，从后面往前截取
		const msgs = msgList?.slice(-30) || []
		if (msgs.length === 0) return
		setMessages(msgs)
	}, [msgList])

	const sendMessage = async (type, content) => {
		console.log(type, content)

		// 构造消息对象
		const msg = {
			msg_id: null,
			msg_is_self: true,
			msg_read_status: msgStatus.NOT_READ,
			msg_type: type,
			msg_content: content,
			msg_send_time: Date.now(),
			msg_sender_id: user.user_id,
			group_id: parseInt(groupId),
			dialog_id: parseInt(dialogId),
			msg_send_state: sendState.LOADING
		}

		// 添加到消息列表
		setMessages([...messages, msg])

		// 发送消息
		try {
			const {
				code,
				data,
				msg: errMsg
			} = await sendToGroup({
				content: msg.msg_content,
				dialog_id: msg.dialog_id,
				group_id: msg.group_id,
				type: msg.msg_type
			})
			code !== 200 &&
				f7.toast
					.create({
						text: errMsg,
						position: 'center',
						closeTimeout: 1000
					})
					.open()
			// 更新消息状态
			msg.msg_send_state = code === 200 ? sendState.OK : sendState.ERROR
			msg.msg_id = data?.msg_id
		} catch {
			// 更新消息状态
			msg.msg_send_state = sendState.ERROR
		} finally {
			// 更新消息列表
			setMessages([...messages, msg])
			// 保存到数据库
			await userService.add(userService.TABLES.GROUP_MSGS, msg)
			// 更新会话
			const chat = await userService.findOneById(userService.TABLES.CHATS, dialogId, 'dialog_id')
			chat &&
				(await userService.update(userService.TABLES.CHATS, dialogId, {
					...chat,
					last_message: msg.msg_content,
					msg_id: msg.msg_id ? msg.msg_id : chat?.msg_id,
					msg_type: msg.msg_type,
					send_time: msg.msg_send_time
				}))
		}
	}

	const handlerMsgLongPress = (type, data) => {
		console.log(type, data)
	}

	useEffect(() => {
		setIsActive(true)
		groupInfoApi({
			group_id: groupId
		}).then(({ code, data }) => {
			code === 200 && setGroupInfo(data)
		})
		groupMemberApi({
			group_id: groupId
		}).then(({ code, data }) => {
			code === 200 && setMembers(data)
		})
	}, [])

	return (
		<Page className="messages-page" noToolbar>
			<MessageBox
				messages={messages}
				header={
					<div className="fixed top-0 left-0 right-0 h-14 border-b flex items-center px-4 z-[999] bg-white">
						<div className="flex items-center w-full">
							<ArrowLeftIcon className="w-5 h-5 mr-3" onClick={() => f7router.back()} />
							<div className="flex items-center">
								<img src={groupInfo?.avatar} alt="" className="w-8 h-8 rounded-full mr-2" />
								<span>{groupInfo?.name}</span>
							</div>
							<div className="flex-1 flex justify-end">
								<MoreIcon
									className="w-7 h-7"
									onClick={() => f7router.navigate(`/chatinfo/${'group'}/${groupId}/`)}
								/>
							</div>
						</div>
					</div>
				}
				footer={<MsgBar send={(content, type = msgType.TEXT) => sendMessage(type, content)} />}
				isFristIn={isActive}
				handlerLongPress={handlerMsgLongPress}
				list={members || []}
			/>
		</Page>
	)
}
