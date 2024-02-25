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

	// 同意加入群聊
	const joinGroup = async (item: any, action: MangageApplyStatus = 0) => {
		try {
			f7.dialog.preloader($t('处理中...'))

			const { code } = await GroupService.manageGroupApplyApi({ group_id: item.group_id, action })

			if (code !== 200) return f7.dialog.alert($t('加入群聊失败'))

			// 更新本地数据
			await UserStore.update(UserStore.tables.apply_list, 'id', item.id, {
				...item,
				status: ApplyStatus.ACCEPT
			})
		} catch (error) {
			console.error('加入群聊失败', error)
			f7.dialog.alert($t('加入群聊失败'))
		} finally {
			f7.dialog.close()
		}
	}

	// 获取群申请状态码文字
	// const getGroupStatusText = (status: GroupApplyStatus) => {
	// 	const group_status = {
	// 		0: '等待验证',
	// 		1: '已通过',
	// 		2: '已拒绝',
	// 		3: '邀请发送者', // '等待中对方验证',
	// 		4: '邀请接收者'
	// 	}
	// 	return group_status[status]
	// }

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
					<ListItem key={index} text={item?.remark || $t('对方没有留言')}>
						<div slot="media" className="w-12 h-12">
							<img
								src={item?.receiver_info?.user_avatar}
								alt=""
								className="w-full h-full object-cover rounded-full"
							/>
						</div>

						{/* <span slot="title">
							{type === ApplyType.FRIEND ? (
								<span>{item?.receiver_info?.user_name}</span>
							) : item.status === GroupApplyStatus.INVITE_SENDER ? (
								<>
									<span className=" text-xs text-gray-500 mx-1">{$t('邀请')}</span>
									{item?.sender_info?.user_name || item?.receiver_info?.user_name}
									<span className=" text-xs text-gray-500 mx-1">{$t('邀请你加入群聊')}</span>
								</>
							) : (
								<>
									{item?.sender_info?.user_name || item?.receiver_info?.user_name}
									<span className=" text-xs text-gray-500 mx-1">{$t('邀请你加入群聊')}</span>
									<span>{item?.group_name}</span>
								</>
							)}
						</span> */}
						<span slot="title">
							{type === ApplyType.FRIEND ? (
								<span>{item?.receiver_info?.user_name}</span>
							) : ![GroupApplyStatus.WAIT, GroupApplyStatus.INVITE_RECEIVER].includes(item.status) ? (
								item.status === GroupApplyStatus.INVITE_SENDER ? '等待' + item.receiver_info.user_name + '验证' : ''
							) : (
								item.sender_info?.user_name +
								'邀请' +
								('你' || item.receiver_info?.user_name) +
								'加入' +
								item.group_name
							)}
							{/* status (0=等待, 1=已通过, 2=已拒绝, 3=邀请发送者, 4=邀请接收者) */}
							{/* 群主或者管理(管理加入群聊) */}
							{/* { item.status === 0 && (item.sender_info.user_id === user_id) ? '等待验证' : (() => {})() } */}
							{/* 普通用户同意(加入群聊) */}
							{/* { item.status === 4 && (() => {})() } */}
						</span>

						<div slot="content" className="pr-2">
							{type === ApplyType.FRIEND ? (
								// 好友
								[ApplyStatus.PENDING, ApplyStatus.INVITE_RECEIVER].includes(item.status) ? (
									user_id === (item?.sender_id || item?.sender_info?.user_id) ? (
										<Button className="text-sm text-gray-500 " disabled>
											{type === ApplyType.FRIEND ? $t('等待对方同意') : $t('申请中')}
										</Button>
									) : (
										<div className="flex">
											<Button
												className="text-sm text-red-500"
												onClick={() => manageFriendApply(item, MangageApplyStatus.REFUSE)}
											>
												拒绝
											</Button>
											<Button
												className="text-sm text-primary"
												onClick={() => manageFriendApply(item, MangageApplyStatus.ACCEPT)}
											>
												同意
											</Button>
										</div>
									)
								) : ApplyStatus.ACCEPT === item.status ? (
									<Button className="text-sm text-primary" disabled>
										{$t('已同意')}
									</Button>
								) : (
									<Button className="text-sm text-primary text-red-500 " disabled>
										{$t('已拒绝')}
									</Button>
								)
							) : ![GroupApplyStatus.WAIT, GroupApplyStatus.INVITE_RECEIVER].includes(item.status) ? (
								<span className=" text-xs text-gray-500 mx-1 whitespace-nowrap">{$t('等待中')}</span>
							) : (
								// 群聊
								<div className="flex">
									{item.status === GroupApplyStatus.WAIT && item?.sender_info?.user_id === user_id && (
										<>
											<Button
												className="text-sm text-red-500"
												onClick={() => manageFriendApply(item, MangageApplyStatus.REFUSE)}
											>
												拒绝
											</Button>
											<Button
												className="text-sm text-primary"
												onClick={() => manageFriendApply(item, MangageApplyStatus.ACCEPT)}
											>
												同意
											</Button>
										</>
									)}
									{item.status === GroupApplyStatus.INVITE_RECEIVER && (
										<>
											<Button
												className="text-sm text-red-500"
												onClick={() => joinGroup(item, MangageApplyStatus.REFUSE)}
											>
												拒绝
											</Button>
											<Button
												className="text-sm text-primary"
												onClick={() => joinGroup(item, MangageApplyStatus.ACCEPT)}
											>
												同意
											</Button>
										</>
									)}
								</div>
							)}
						</div>
					</ListItem>
				))}
			</List>
		</Page>
	)
}

export default ApplyList
