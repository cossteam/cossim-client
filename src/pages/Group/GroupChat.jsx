import { Link, Message, Messagebar, Messages, NavTitle, Navbar, Page } from 'framework7-react'
import React, { useState, useEffect } from 'react'
import PropType from 'prop-types'
import { $t } from '@/i18n'
import { groupInfoApi, groupMemberApi } from '@/api/group'
import { sendToGroup } from '@/api/msg'

GroupChat.propTypes = {
	f7route: PropType.object.isRequired
}
export default function GroupChat({ f7route }) {
	const GroupId = f7route.params.id // 群号 /（TODO：用户ID）
	const DialogId = f7route.query.dialog_id // 会话 ID
	const [chatInfo, setGroupInfo] = useState({}) // 群聊信息
	const [member, setMember] = useState([]) // 成员信息
	const [messages, setMessages] = useState([]) // 消息列表
	useEffect(() => {
		// 获取群聊信息
		groupInfoApi({ gid: GroupId }).then(({ code, data }) => {
			code === 200 && setGroupInfo(data)
		})
		// 获取成员信息
		groupMemberApi({ group_id: GroupId }).then(({ code, data }) => {
			code === 200 && setMember(data)
		})
		// 获取消息列表
		setMessages([])
	}, [])
	useEffect(() => {
		console.log('member', member)
		console.log('chatInfo', chatInfo)
		console.log('messages', messages)
	}, [chatInfo, member])

	// 发送消息
	const [msgText, setMsgText] = useState('')
	const sendMessage = async () => {
		console.log('msgText', msgText)
		if (!msgText) {
			Message.toast($t('请输入消息'), { duration: 2000 })
			return
		}
		// 发送消息
		sendToGroup({
			content: msgText,
			dialog_id: parseInt(DialogId),
			group_id: parseInt(GroupId),
			type: 1
		}).then(({ code, data }) => {
			console.log(code, data)
			code === 200 && setMsgText('')
		})
	}

	return (
		<Page className="chat-group-page messages-page" noToolbar messagesContent>
			<Navbar className="messages-navbar" backLink>
				<NavTitle>
					<div className="mr-16">{$t(chatInfo.name)}</div>
				</NavTitle>
				{/* <Link slot="right" className="profile-link">
					<img
						src={
							chatInfo.avatar
						}
						loading="lazy"
					/>
				</Link> */}
			</Navbar>
			{/* 消息输入框 */}
			<Messagebar value={msgText} placeholder={$t('请输入消息')} onInput={(e) => setMsgText(e.target.value)}>
				<Link slot="inner-start" iconF7="plus" />
				<Link slot="after-area" className="messagebar-sticker-link" iconF7="smiley" onClick={() => {}} />
				<Link
					slot="inner-end"
					className="messagebar-send-link"
					iconF7="paperplane_fill"
					onClick={() => sendMessage()}
				/>
			</Messagebar>
			<Messages>
				{/* {Array(200)
					.fill(1)
					.map((i, index) => (
						<Message key={index}>{index}</Message>
					))} */}
			</Messages>
		</Page>
	)
}
