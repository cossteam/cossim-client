import { Button, List, ListItem, NavTitle, Navbar, Page, Segmented, f7 } from 'framework7-react'
import { useEffect, useState } from 'react'
import { useAsyncEffect } from '@reactuses/core'
import { isEqual } from 'lodash-es'

import RelationService from '@/api/relation'
import { $t, ApplyStatus, ApplyType, USER_ID, MangageApplyStatus, GroupApplyStatus } from '@/shared'
import { getCookie } from '@/utils/cookie'
import GroupService from '@/api/group'
import UserStore from '@/db/user'
import { useStateStore } from '@/stores/state'
import { useLiveQuery } from 'dexie-react-hooks'

const user_id = getCookie(USER_ID) || ''

const ApplyList = () => {
	const [type, setType] = useState<ApplyType>(ApplyType.FRIEND)
	const [applyList, setApplyList] = useState<any[]>([])

	const { updateContacts } = useStateStore()

	const allApplyList = useLiveQuery(() => UserStore.findAll(UserStore.tables.apply_list)) || []

	const updateApplyList = async () => {
		const applyList = await UserStore.findAll(UserStore.tables.apply_list)
		const newApplyList = applyList.filter((v) => (type === ApplyType.FRIEND ? v?.sender_id : !v?.sender_id))
		setApplyList(newApplyList)
		return newApplyList
	}

	const updateApplyListInit = async () => {
		try {
			const applyList = await updateApplyList()

			console.log('applyList', applyList)

			const { data } =
				type === ApplyType.FRIEND
					? await RelationService.friendApplyListApi({ user_id })
					: await GroupService.groupRequestListApi({ user_id })

			data.map(async (item: any) => {
				const apply = applyList.find((v) => v?.id === item?.id)

				if (apply) {
					!isEqual(apply, item) && (await UserStore.update(UserStore.tables.apply_list, 'id', item?.id, item))
				} else {
					await UserStore.add(UserStore.tables.apply_list, { ...item })
				}
			})
		} catch (error) {
			console.error('获取申请列表失败', error)
		}
	}

	useEffect(() => {
		if (!allApplyList.length) return
		console.log('获取更新', allApplyList)
		updateApplyList()
		// const newApplyList = applyList.filter((v) => (type === ApplyType.FRIEND ? v?.sender_id : !v?.sender_id))
		// setApplyList(newApplyList)
	}, [allApplyList])

	useAsyncEffect(
		async () => {
			await updateApplyListInit()
		},
		() => {},
		[type]
	)

	/**
	 * 管理好友请求
	 *
	 * @param item 		好友请求列表详情
	 * @param action 	1:同意 0:拒绝
	 */
	const manageFriendApply = async (item: any, action: MangageApplyStatus = 0) => {
		try {
			f7.dialog.preloader($t('处理中...'))

			// 是否同意
			const isAgree = action === MangageApplyStatus.ACCEPT

			let e2e_public_key = ''

			// TODO: 传输 e2e_public_key
			if (isAgree) {
				e2e_public_key = 'test'
			}

			const { code } =
				type === ApplyType.FRIEND
					? await RelationService.manageFriendApplyApi({ request_id: item.id, action, e2e_public_key })
					: await GroupService.manageGroupRequestApi({ group_id: item.group_id, action, e2e_public_key })

			if (code !== 200) return f7.dialog.alert($t('处理好友请求失败'))

			// 更新本地数据
			await UserStore.update(UserStore.tables.apply_list, 'id', item.id, {
				...item,
				status: isAgree ? ApplyStatus.ACCEPT : ApplyStatus.REFUSE
			})

			// 更新数据
			await updateApplyListInit()

			// 更新好友列表
			updateContacts(true)
		} catch (error) {
			console.error('处理好友请求失败', error)
			f7.dialog.alert($t('处理好友请求失败'))
		} finally {
			f7.dialog.close()
		}
	}

	// 获取好友请状态码文字
	const getFriendStatusText = (status: ApplyStatus) => {
		const friend_status = {
			0: '等待验证', // 操作
			1: '已通过',
			2: '已拒绝',
			3: '已发送', // 等待中对方验证
			4: '已接收' // 操作
		}
		return friend_status[status]
	}

	// 获取群申请状态码文字
	const getGroupStatusText = (status: GroupApplyStatus) => {
		const group_status = {
			0: '等待验证', // 操作
			1: '已通过',
			2: '已拒绝',
			3: '邀请发送者', // 等待中对方验证
			4: '邀请接收者' // 操作
		}
		return group_status[status]
	}

	return (
		<Page noToolbar className="bg-bgTertiary" onPageBeforeOut={() => updateContacts(true)}>
			<Navbar backLink className="coss_applylist_navbar bg-bgPrimary hidden-navbar-bg">
				<NavTitle>
					<Segmented strong>
						<Button active={type === ApplyType.FRIEND} onClick={() => setType(ApplyType.FRIEND)}>
							{$t('好友申请')}
							{/* {applyFriendTotal !== 0 && (
								<Badge color="red" className="ml-1">
									{applyFriendTotal}
								</Badge>
							)} */}
						</Button>
						<Button active={type === ApplyType.GROUP} onClick={() => setType(ApplyType.GROUP)}>
							{$t('群聊申请')}
							{/* {applyGroupTotal !== 0 && (
								<Badge color="red" className="ml-1">
									{applyGroupTotal}
								</Badge>
							)} */}
						</Button>
					</Segmented>
				</NavTitle>
			</Navbar>

			<List strongIos className="mt-0" mediaList>
				{applyList.map((item, index) => (
					<ListItem key={index} title={item?.remark || $t('对方没有留言')}>
						<div slot="media" className="w-12 h-12">
							<img
								src={item?.receiver_info?.user_avatar}
								alt=""
								className="w-full h-full object-cover rounded-full"
							/>
						</div>
						{/* 区分好友申请和群申请 */}
						{type === ApplyType.FRIEND ? (
							<>
								<span slot="text">
									<span>{item?.receiver_info?.user_name}</span>
								</span>
								<div slot="content" className="pr-2"></div>
							</>
						) : (
							<>
								<span slot="text">$t('群聊')</span>
								<div slot="content" className="pr-2"></div>
							</>
						)}
					</ListItem>
				))}
			</List>
		</Page>
	)
}

export default ApplyList
