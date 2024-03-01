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
		// console.log(newApplyList)
		setApplyList(newApplyList)
		return newApplyList
	}

	const updateApplyListInit = async () => {
		try {
			const applyList = await updateApplyList()

			const { data } =
				type === ApplyType.FRIEND
					? await RelationService.friendApplyListApi({ user_id })
					: await GroupService.groupRequestListApi({ user_id })
			// console.log(data)
			data.map(async (item: any) => {
				const apply = applyList.find((v) => {
					// console.log(v.id, v)
					return v.id === (type === ApplyType.FRIEND ? item?.id : `group_${item?.id}`)
				})
				// console.log('apply', Boolean(apply), apply?.status, apply)
				if (apply) {
					// console.log(isEqual(apply, item), apply, item)
					!isEqual(apply, item) && (await UserStore.update(UserStore.tables.apply_list, 'id', item?.id, item))
				} else {
					await UserStore.add(UserStore.tables.apply_list, {
						...item,
						id: type === ApplyType.FRIEND ? item.id : `group_${item.id}`
					})
				}
			})
		} catch (error: any) {
			console.error('获取申请列表失败', error?.message)
		}
	}

	useEffect(() => {
		if (!allApplyList.length) return
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

			const { code, msg } =
				type === ApplyType.FRIEND
					? await RelationService.manageFriendApplyApi({ request_id: item.id, action, e2e_public_key })
					: item?.status === ApplyStatus.INVITE_RECEIVER // 是否是被邀请者
						? await GroupService.manageGroupRequestApi({
								group_id: item.group_id,
								action,
								id: parseInt(item.id.split('_')[1])
							})
						: await GroupService.manageGroupRequestAdminApi({
								group_id: item.group_id,
								action,
								id: parseInt(item.id.split('_')[1])
							})

			if (code !== 200) {
				f7.dialog.alert($t(msg))
				return
			}

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

	// 获取申请状态码文字
	const getStatusText = (status: GroupApplyStatus) => {
		// const friend_status = {
		// 	0: '申请中',
		// 	1: '已同意',
		// 	2: '已拒绝'
		// }
		const group_status = {
			0: '待验证', // 操作
			1: '已通过',
			2: '已拒绝',
			3: '待验证', // 邀请发送者
			4: '邀请接收者' // 操作
		}
		return group_status[status]
	}

	// 是否可操作
	const isOperate = ({ status, sender_id }: any) => {
		if (type === ApplyType.FRIEND) {
			// 好友
			return status === ApplyStatus.PENDING && sender_id !== user_id
		} else {
			// 群
			return status === ApplyStatus.PENDING || status === ApplyStatus.INVITE_RECEIVER
		}
	}

	// 是否邀请者
	const isRreceiver = ({ status, sender_info }: any) => {
		return type === ApplyType.FRIEND ? sender_info.user_id === user_id : status === ApplyStatus.INVITE_SENDER
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
				{applyList.map((item, index) =>
					// 区分好友申请和群申请
					type === ApplyType.FRIEND ? (
						// 好友
						<ListItem key={index} text={$t(item?.remark || '对方没有留言')}>
							<div slot="media" className="w-12 h-12">
								<img
									src={item?.receiver_info?.user_avatar}
									className="w-full h-full object-cover rounded-full bg-black bg-opacity-10"
								/>
							</div>
							<div slot="title">
								<span>{$t(item?.receiver_info?.user_name)}</span>
							</div>
							<div slot="content" className="pr-2 flex">
								{!isOperate(item) ? (
									<Button className="text-sm text-gray-500" onClick={() => {}}>
										{getStatusText(item.status)}
									</Button>
								) : (
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
							</div>
						</ListItem>
					) : (
						// 群聊
						<ListItem key={index} text={$t(item?.remark || '对方没有留言')}>
							<div slot="media" className="w-12 h-12">
								<img
									src={item?.receiver_info?.user_avatar}
									className="w-full h-full object-cover rounded-full bg-black bg-opacity-10"
								/>
							</div>
							<div slot="title">
								<span>{$t(isRreceiver(item) ? '你' : item?.sender_info?.user_name)}</span>
								<span>{$t('邀请')}</span>
								<span>{$t(isRreceiver(item) ? item?.receiver_info?.user_name : '你')}</span>
								<span>{$t('加入')}</span>
								<span>{$t(item?.group_name)}</span>
							</div>
							<div slot="content" className="pr-2 flex">
								{!isOperate(item) ? (
									<Button className="text-sm text-gray-500" onClick={() => {}}>
										{getStatusText(item.status)}
									</Button>
								) : (
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
							</div>
						</ListItem>
					)
				)}
			</List>
		</Page>
	)
}

export default ApplyList
