import { Button, List, ListItem, SwipeoutActions, SwipeoutButton } from 'framework7-react'
import React from 'react'
import PropTypes from 'prop-types'
import { $t } from '@/i18n'

RequestList.propTypes = {
	listData: PropTypes.array.isRequired,
	confirm: PropTypes.func.isRequired
}

export default function RequestList({ listData, confirm }) {
	const text = {
		tips: $t('对方没有留言'),
		btn_agree: $t('同意'),
		btn_refuse: $t('拒绝'),
		agree: $t('已同意'),
		refuse: $t('已拒绝')
	}

	return (
		<>
			{listData.length === 0 ? (
				<div className="text-center">
					<h2 className="text-gray-500 text-sm">当前没有好友请求</h2>
				</div>
			) : (
				<List noChevron dividers mediaList className="my-0">
					{listData.map((chat) => (
						<ListItem
							key={chat.user_id}
							title={chat.nickname}
							swipeout
							// link
						>
							<img
								slot="media"
								src={chat?.avatar || chat?.group_avatar}
								loading="lazy"
								alt={chat?.nickname || chat?.group_name}
								className="w-10 h-10 rounded-full"
							/>
							<span slot="text" className="text-gray-500 text-sm">
								{chat?.msg || text.tips}
							</span>
							{/*
							 * TODO：
							 *      好友状态 status 申请状态 (1=已同意, 2=已拒绝)
							 *      群聊申请列表 status 申请状态 (0=申请中, 1=已加入, 2=被拒绝, 3=被封禁)
							 */}
							{chat.status === 1 || chat.group_status === 1 ? (
								<span className="text-gray-500 text-sm whitespace-nowrap pr-2" slot="content">
									{text.agree}
								</span>
							) : chat.status === 2 || chat.group_status === 2 ? (
								<span className="text-gray-500 text-sm whitespace-nowrap pr-2" slot="content">
									{text.refuse}
								</span>
							) : (
								<div slot="content" className="pr-2 flex">
									<Button
										className="text-sm text-red-500"
										onClick={() => confirm(chat?.user_id, 0, chat?.group_id)}
									>
										{text.btn_refuse}
									</Button>
									<Button
										className="text-sm text-primary"
										onClick={() => confirm(chat?.user_id, 1, chat?.group_id)}
									>
										{text.btn_agree}
									</Button>
								</div>
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
