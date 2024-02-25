import { Button, List, ListItem, SwipeoutActions, SwipeoutButton } from 'framework7-react'
import React from 'react'
import PropTypes from 'prop-types'
import { useUserStore } from '@/stores/user'

RequestList.propTypes = {
	listData: PropTypes.array.isRequired,
	confirm: PropTypes.func.isRequired
}

export default function RequestList({ listData, confirm }) {
	const userStore = useUserStore()

	const getUserStatusText = (status) => {
		const user_status = {
			0: '申请中',
			1: '已同意',
			2: '已拒绝'
		}
		return user_status[status]
	}
	const getGroupStatusText = (status) => {
		const group_status = {
			0: '等待验证',
			1: '已通过',
			2: '已拒绝',
			3: '邀请发送者',
			4: '邀请接收者'
		}
		return group_status[status]
	}
	return (
		<>
			{listData.length === 0 ? (
				<div className="text-center">
					<h2 className="text-gray-500 text-sm">当前没有好友请求</h2>
				</div>
			) : (
				<List noChevron dividers mediaList className="my-0">
					{listData.map((chat, index) => (
						<ListItem
							key={index}
							swipeout
							// link
						>
							<img
								slot="media"
								src={chat?.receiver_info?.user_avatar || chat?.group_avatar}
								loading="lazy"
								alt={chat?.user_name || chat?.group_name}
								className="w-10 h-10 rounded-full"
							/>
							<span slot="title">
								{chat?.sender_info?.user_name || chat?.receiver_info?.user_name}
								{chat?.group_name ? (
									<>
										<span className=" text-xs text-gray-500">邀请你加入</span>
										<span>{chat?.group_name}</span>
									</>
								) : (
									''
								)}
							</span>
							<span slot="text" className="text-gray-500 text-sm">
								{chat?.msg || '对方没有留言'}
							</span>
							{chat.status == 0 ||
							(chat.status == 4 && userStore.user.user_id === chat.receiver_info.user_id) ? (
								<div slot="content" className="pr-2 flex">
									<Button
										className="text-sm text-red-500"
										onClick={() => confirm(chat?.id, 0, chat?.group_id)}
									>
										拒绝
									</Button>
									<Button
										className="text-sm text-primary"
										onClick={() => confirm(chat?.id, 1, chat?.group_id)}
									>
										同意
									</Button>
								</div>
							) : (
								<span className="text-gray-500 text-sm whitespace-nowrap pr-2" slot="content">
									{getUserStatusText(chat.status) || getGroupStatusText(chat.status)}
								</span>
							)}
							<SwipeoutActions right>
								<SwipeoutButton close color="red">
									<span>删除</span>
								</SwipeoutButton>
							</SwipeoutActions>
						</ListItem>
					))}
				</List>
			)}
		</>
	)
}
