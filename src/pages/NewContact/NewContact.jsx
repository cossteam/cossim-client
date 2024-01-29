import React, { useState, useEffect } from 'react'
import { Page, Navbar, Button, Subnavbar, Segmented, Block, f7 } from 'framework7-react'
import RequestList from './RequestList'
import { $t } from '@/i18n'
import { useUserStore } from '@/stores/user'
import { useRelationRequestStore } from '@/stores/relationRequest'
// import { dbService } from '@/db'
// import { exportPublicKey } from '@/utils/signal/signal-crypto'
import { friendApplyListApi } from '@/api/relation'
import { groupRequestListApi } from '@/api/group'
import { confirmAddFriendApi } from '@/api/relation'
import { confirmAddGroupApi } from '@/api/group'
import commonService from '@/db/common'
import { exportKey } from '@/utils/tweetnacl'

// import PropTypes from 'prop-types'
// NewContact.propTypes = {
// 	f7route: PropTypes.object
// }

export default function NewContact() {
	const { user } = useUserStore()

	// 选项卡
	const { friendResquest, updateFriendResquest, groupResquest, updateGroupResquest } = useRelationRequestStore() // 获取申请列表
	const tabbar = [
		{
			key: 'friend',
			title: $t('联系人'),
			data: friendResquest || [],
			onClick: () => setActiveTabbar(0),
			itemConfirm: async (id, status) => {
				// const users = await dbService.findOneById(dbService.TABLES.USERS, user?.user_id)
				// if (!users) return f7.dialog.alert('系统内部错误')
				const result = await commonService.findOneById(commonService.TABLES.HISTORY, user?.user_id)
				
				if (!result) f7.dialog.alert('本地数据库中没有该用户！请重新登录后重试')

				const directory = {
					publicKey: exportKey(result?.data?.keyPair?.publicKey)
				}
				// const exportedPublicKey = await crypto.subtle.exportKey('spki', users?.data?.keyPair?.publicKey)
				// const exportedKeyBase64 = fromUint8Array(new Uint8Array(exportedPublicKey))
				// const directory = {
				// 	...JSON.parse(users?.data?.directory),
				// 	publicKey: await exportPublicKey(users?.data?.keyPair?.publicKey)
				// }
				// 同意或拒绝添加好友
				console.log("id",id);
				const { code } = await confirmAddFriendApi({
					request_id: id,
					e2e_public_key: JSON.stringify(directory),
					action: status
				})
				getResquestList() // 更新列表
				if (code !== 200) return

				// 修改状态
				const newUsers = friendResquest.map((user) => {
					// 0 初始状态 1 已同意 2 已拒绝
					return user.user_id === id ? { ...user, status: status === 0 ? 2 : 1 } : user
				})
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
					action: status, // 1 同意 0 拒绝
					id
				})
				getResquestList() // 更新列表
				if (code !== 200) return

				// 修改状态
				const newGroups = groupResquest.map((group) => {
					// 0 初始状态 1 已同意 2 已拒绝
					return group.user_id === id ? { ...group, status: status === 0 ? 2 : 1 } : group
				})
				updateGroupResquest(newGroups)
			}
		}
	]
	const [activeTabbar, setActiveTabbar] = useState(0)
	// 获取申请列表
	const getResquestList = () => {
		friendApplyListApi().then(({ data }) => {
			updateFriendResquest(data || [])
		})
		groupRequestListApi().then(({ data }) => {
			updateGroupResquest(data || [])
		})
	}
	useEffect(() => {
		getResquestList()
	}, [activeTabbar])

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
