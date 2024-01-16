import React, { useEffect, useState } from 'react'
import { Page, Navbar, List, ListItem, SwipeoutActions, SwipeoutButton, Icon, Button } from 'framework7-react'
// import PropTypes from 'prop-types'
import { friendApplyListApi, confirmAddFriendApi } from '@/api/relation'

import { $t } from '@/i18n'


// NewContact.propTypes = {
// 	users: PropTypes.object
// }

export default function NewContact() {
	const [users, setUsers] = useState([])

	useEffect(() => {
		;(async () => {
			const res = await friendApplyListApi()
			if (res.code !== 200) return
			setUsers(res.data)
			console.log('user', res.data)
		})()
	}, [])

	const text = {
		tips: $t('对方没有留言'),
		btn_agree: $t('同意'),
		btn_refuse: $t('拒绝')
	}

    // const confirm = async () => {
    //     const res = await confirmAddFriendApi()
    // }

	return (
		<Page noToolbar className="new-contact">
			<Navbar title={$t('新朋友')} backLink="Back" backLinkShowText="" />
			<List noChevron dividers mediaList className="my-0">
				{users.map((chat) => (
					<ListItem
						key={chat.user_id}
						title={chat.nickname}
						// subtitle={chat?.msg || text.tips}
						swipeout
						// link
					>
						<img
							slot="media"
							src={chat.avatar}
							loading="lazy"
							alt={chat.nickname}
							className="w-10 h-10 rounded-full"
						/>
						<span slot="text" className="text-gray-500 text-sm">
							{chat?.msg || text.tips}
						</span>

						<div slot="content" className='pr-2 flex'>
							<Button className="text-sm text-red-500">{text.btn_refuse}</Button>
                            <Button className="text-sm text-primary">{text.btn_agree}</Button>
						</div>

						<SwipeoutActions right>
							{/* onClick={del} */}
							<SwipeoutButton close color="red">
								{/* <Icon f7="ellipsis" /> */}
								<span>删除</span>
							</SwipeoutButton>
						</SwipeoutActions>
					</ListItem>
				))}
			</List>
		</Page>
	)
}
