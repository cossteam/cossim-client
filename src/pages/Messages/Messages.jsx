import React, { useState, useEffect } from 'react'
import PropType from 'prop-types'
import { useLiveQuery } from 'dexie-react-hooks'
import { Page } from 'framework7-react'
import './Messages.less'
import userService from '@/db'
import MessageBox from '@/components/Message/Chat'
import { groupMemberApi, groupInfoApi } from '@/api/group'

export default function MessagesPage({ f7route, f7router }) {
	// 会话 id
	const { dialog_id, group_id } = f7route.query
	// 接收人 id
	const { id: RECEIVER_ID } = f7route.params

	const DIALOG_ID = parseInt(dialog_id || 0)
	const GROUP_ID = parseInt(group_id || 0)

	// 好友信息
	const [contact, setContact] = useState({})
	// 好友信息列表
	const [friendsList, setFriendsList] = useState([])

	// 数据库所有消息
	const msgList = useLiveQuery(() => userService.findOneAll(userService.TABLES.USER_MSGS, 'dialog_id', DIALOG_ID))
	const groupList = useLiveQuery(() => userService.findOneAll(userService.TABLES.GROUP_MSGS, 'group_id', GROUP_ID))

	// 基本初始化
	const initFriendMessage = async () => {
		// 设置户消息
		const userContact = await userService.findOneById(userService.TABLES.FRIENDS_LIST, RECEIVER_ID, 'user_id')
		setFriendsList([userContact])
		setContact(userContact)
	}

	// TODO: 从本地数据库获取
	const initGroupoessage = async () => {
		const reslut = await groupMemberApi({ group_id: GROUP_ID })
		const info = await groupInfoApi({ group_id: GROUP_ID })
		if (reslut.code === 200) {
			console.log("reslut.data",reslut.data);
			setFriendsList(reslut.data)
			setContact(info.data)
		}
	}

	useEffect(() => {
		GROUP_ID ? initGroupoessage() : initFriendMessage()
	}, [])

	return (
		<Page className="messages-page" noToolbar>
			<MessageBox
				list={friendsList}
				contact={contact}
				f7router={f7router}
				msgList={GROUP_ID ? groupList : msgList}
				is_group={GROUP_ID ? true : false}
				receiver_id={RECEIVER_ID}
				dialog_id={DIALOG_ID}
				group_id={GROUP_ID}
			/>
		</Page>
	)
}

MessagesPage.propTypes = {
	f7route: PropType.object.isRequired,
	f7router: PropType.object.isRequired
}
