import { Button, List, ListItem, SwipeoutActions, SwipeoutButton } from 'framework7-react'
import React from 'react'
import PropTypes from 'prop-types'

RequestList.propTypes = {
	listData: PropTypes.array.isRequired,
	confirm: PropTypes.func.isRequired
}

export default function RequestList({ listData, confirm }) {
	const getUserStatusText = (status) => {
		const user_status = {
			0: '申请中',
			1: '待通过',
			2: '已添加',
			3: '已拒绝',
			4: '已拉黑',
			5: '已删除'
		}
		return user_status[status]
	}
	const getGroupStatusText = (status) => {
		const group_status = {
			0: '申请中',
			1: '待通过',
			2: '已加入',
			3: '已删除',
			4: '已拒绝',
			5: '被封禁'
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
								{chat?.receiver_info?.user_name}
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
							{chat.group_status == 1 || chat.user_status == 0 ? (
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
									{getUserStatusText(chat.user_status) || getGroupStatusText(chat.group_status)}
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
