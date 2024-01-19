import React, { useState } from 'react'
import { Page, Navbar, Button, Subnavbar, Segmented, Block } from 'framework7-react'
import { confirmAddFriendApi } from '@/api/relation'
import { confirmAddGroupApi } from '@/api/group'
import { useUserStore } from '@/stores/user'

import { $t } from '@/i18n'
import RequestList from './RequestList'
import { useRelationRequestStore } from '@/stores/relationRequest'
// import WebDB from '@/db'

// import PropTypes from 'prop-types'
// NewContact.propTypes = {
// 	f7route: PropTypes.object
// }

export default function NewContact() {
	const { directory } = useUserStore()

	// 选项卡
	const { friendResquest, updateFriendResquest, groupResquest, updateGroupResquest } = useRelationRequestStore() // 获取申请列表
	const tabbar = [
		{
			key: 'friend',
			title: $t('联系人'),
			data: friendResquest || [],
			onClick: () => setActiveTabbar(0),
			itemConfirm: async (id, status) => {
				// 同意或拒绝添加好友
				const { code } = await confirmAddFriendApi({ user_id: id, e2e_public_key: directory, action: status })
				if (code !== 200) return

				// 修改状态
				const newUsers = friendResquest.map((user) => {
					// 0 初始状态 1 已同意 2 已拒绝
					return user.user_id === id ? { ...user, status: status === 0 ? 2 : 1 } : user
				})

				// TODO: 添加好友到本地
				// WebDB.contacts.add({  })

				updateFriendResquest(newUsers)
			}
		},
		{
			key: 'group',
			title: $t('群聊'),
			data: groupResquest || [],
			onClick: () => setActiveTabbar(1),
			itemConfirm: async (id, status, group_id) => {
				// 同意或拒绝加入群聊
				const { code } = await confirmAddGroupApi({
					group_id,
					user_id: id,
					action: status // 1 同意 0 拒绝
				})
				if (code !== 200) return

				// 修改状态
				const newGroups = groupResquest.map((group) => {
					// 0 初始状态 1 已同意 2 已拒绝
					return group.user_id === id ? { ...group, status: status === 0 ? 2 : 1 } : group
				})

				// TODO: 添加好友到本地
				// WebDB.contacts.add({  })

				updateGroupResquest(newGroups)
			}
		}
	]
	const [activeTabbar, setActiveTabbar] = useState(0)

	return (
		<Page noToolbar className="new-contact">
			<Navbar title={$t('新请求')} backLink="Back" backLinkShowText="">
				<Subnavbar>
					<Segmented strong>
						{tabbar.map((item, index) => (
							<Button
								key={index}
								smallMd
								active={item.key === tabbar[activeTabbar].key}
								onClick={item.onClick}
							>
								{item.title}
							</Button>
						))}
					</Segmented>
				</Subnavbar>
			</Navbar>
			<Block>
				<RequestList listData={tabbar[activeTabbar].data} confirm={tabbar[activeTabbar].itemConfirm} />
			</Block>
		</Page>
	)
}
