import {
	Button,
	List,
	ListItem,
	NavTitle,
	Navbar,
	Page,
	Segmented,
	SwipeoutActions,
	SwipeoutButton,
	f7,
	NavRight
} from 'framework7-react'
import { useMemo, useState } from 'react'

import RelationService from '@/api/relation'
import { $t, ApplyStatus, ApplyType, USER_ID, MangageApplyStatus, GroupApplyStatus, toastMessage } from '@/shared'
import { getCookie } from '@/utils/cookie'
import GroupService from '@/api/group'
import UserStore from '@/db/user'
import Empty from '@/components/Empty'
import useCacheStore from '@/stores/cache'
import { getApplyList, getFriendList, getRemoteSession } from '@/run'
import { useAsyncEffect } from '@reactuses/core'
import { Plus } from 'framework7-icons/react'
import Avatar from '@/components/Avatar/Avatar.tsx'

const user_id = getCookie(USER_ID) || ''

const ApplyList = () => {
	const [type, setType] = useState<ApplyType>(ApplyType.FRIEND)
	const cacheStore = useCacheStore()
	const applyList = useMemo(() => {
		return type === ApplyType.FRIEND ? cacheStore.friendApply : cacheStore.groupApply
	}, [type, cacheStore.friendApply, cacheStore.groupApply])

	useAsyncEffect(
		async () => {
			await getApplyList()
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
								id: item.id // parseInt(item.id.split('_')[1])
							})
						: await GroupService.manageGroupRequestAdminApi({
								group_id: item.group_id,
								action,
								id: item.id // parseInt(item.id.split('_')[1])
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
			await getApplyList()
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
	const isRreceiver = ({ status, sender_info = {} }: any) => {
		if (type === ApplyType.FRIEND) {
			return sender_info.user_id === user_id
		}
		if (!(status === ApplyStatus.ACCEPT)) {
			return status === ApplyStatus.INVITE_SENDER
		}
		return sender_info?.user_id === user_id
	}

	/**
	 * 删除申请
	 * @param item 好友请求信息
	 */
	const deleteApply = async (item: any) => {
		try {
			const isFriend = type === ApplyType.FRIEND
			const id = item.id // isFriend ? item.id : Number((item.id ?? '').split('_')[1])
			const { code, msg } = isFriend
				? await RelationService.deleteFriendApplyApi({ id })
				: await RelationService.deleteGroupApplyApi({ id })
			toastMessage(code === 200 ? '删除成功' : msg)
			if (code !== 200) return
			await getApplyList()
		} catch (error) {
			console.log(error)
			toastMessage('删除失败')
		}
	}

	const handlerClick = async (item: any) => {
		await manageFriendApply(item, MangageApplyStatus.ACCEPT)
		getFriendList()
		getRemoteSession()
	}

	return (
		<Page noToolbar className="bg-bgTertiary">
			<Navbar backLink className="coss_applylist_navbar bg-bgPrimary hidden-navbar-bg">
				<NavTitle>
					<Segmented strong>
						<Button active={type === ApplyType.FRIEND} onClick={() => setType(ApplyType.FRIEND)}>
							{$t('好友申请')}
						</Button>
						<Button active={type === ApplyType.GROUP} onClick={() => setType(ApplyType.GROUP)}>
							{$t('群聊申请')}
						</Button>
					</Segmented>
				</NavTitle>
				<NavRight>
					<ListItem link="/add_friend/" popoverClose className="coss_dialog_list">
						<Plus className="w-7 h-7" />
					</ListItem>
				</NavRight>
			</Navbar>

			{applyList.length <= 0 ? (
				<Empty />
			) : (
				<List strongIos className="m-0" mediaList>
					{applyList.map((item, index) =>
						// 区分好友申请和群申请
						type === ApplyType.FRIEND ? (
							// 好友
							<ListItem key={index} text={$t(item?.remark || '对方没有留言')} swipeout>
								<div slot="media" className="w-12 h-12">
									<Avatar size={50} src={item?.receiver_info?.user_avatar} />
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
											<Button className="text-sm text-primary" onClick={() => handlerClick(item)}>
												同意
											</Button>
										</>
									)}
								</div>
								<SwipeoutActions right>
									<SwipeoutButton close color="red" onClick={() => deleteApply(item)}>
										{$t('删除')}
									</SwipeoutButton>
								</SwipeoutActions>
							</ListItem>
						) : (
							// 群聊
							<ListItem key={index} text={$t(item?.remark || '对方没有留言')} swipeout>
								<div slot="media" className="w-12 h-12">
									<Avatar size={50} src={item?.receiver_info?.user_avatar} />
								</div>
								<div slot="title">
									{item?.sender_info && item?.receiver_info ? (
										<>
											<span>{$t(isRreceiver(item) ? '你' : item?.sender_info?.user_name)}</span>
											<span>{$t('邀请')}</span>
											<span>{$t(isRreceiver(item) ? item?.receiver_info?.user_name : '你')}</span>
											<span>{$t('加入')}</span>
										</>
									) : !item?.sender_info ? (
										<>
											<span>{$t(item?.receiver_info?.user_name)}</span>
											<span>{$t('申请加入')}</span>
										</>
									) : (
										<>
											<span>{$t(item?.sender_info?.user_name)}</span>
											<span>{$t('邀请')}</span>
											<span>{$t(item?.receiver_info?.user_name)}</span>
											<span>{$t('加入')}</span>
										</>
									)}
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
								<SwipeoutActions right>
									<SwipeoutButton close color="red" onClick={() => deleteApply(item)}>
										{$t('删除')}
									</SwipeoutButton>
								</SwipeoutActions>
							</ListItem>
						)
					)}
				</List>
			)}
		</Page>
	)
}

export default ApplyList
