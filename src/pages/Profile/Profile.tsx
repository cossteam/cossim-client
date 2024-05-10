import { Icon, Link, List, ListButton, ListItem, Navbar, Page, Toggle } from 'framework7-react'
import { useMemo, useState } from 'react'
import { $t, MessageBurnAfterRead, MessageNoDisturb, RelationStatus, confirmMessage, toastMessage } from '@/shared'
import UserService from '@/api/user'
import RelationService from '@/api/relation'
import { useLiveRoomStore } from '@/stores/liveRoom'
import Avatar from '@/components/Avatar/Avatar.tsx'
import useMessageStore from '@/stores/message'
import useCacheStore from '@/stores/cache'
import useLoading from '@/hooks/useLoading'
import { getFriendList, getRemoteSession } from '@/run.ts'

const times = [
	{ label: $t('10秒'), value: 10 },
	{ label: $t('1分钟'), value: 60 },
	{ label: $t('10分钟'), value: 600 }
]

const Profile: React.FC<RouterProps> = ({ f7route, f7router }) => {
	const user_id = f7route.params.user_id as string
	const is_from_message_page = f7route.query.from_page === 'message'
	const dialog_id = Number(f7route.query.dialog_id) ?? 0

	const liveRoomStore = useLiveRoomStore()
	const cacheStore = useCacheStore()
	const messageStore = useMessageStore()

	const [userInfo, setUserInfo] = useState<any>()
	const { watchAsyncFn } = useLoading()

	// 首次进去页面
	const onPageBeforeIn = async () => {
		try {
			const userInfo = cacheStore.cacheContacts?.find((item) => item?.user_id === user_id)
			setUserInfo(userInfo)
			UserService.getUserInfoApi({ user_id }).then(({ code, data }) => {
				if (code !== 200) return
				const updateData = { ...userInfo, ...data }
				setUserInfo(updateData)
				updateCache({}, updateData)
			})
		} catch (error) {
			console.error('onPageBeforeIn', error)
		}
	}

	// 更新缓存，公共函数
	const updateCache = (options: any = {}, outOptions: any = {}) => {
		const updateInfo = { ...userInfo, preferences: { ...userInfo?.preferences, ...options }, ...outOptions }
		setUserInfo(updateInfo)
		const friendList = cacheStore.cacheContacts?.map((item) => {
			if (item?.user_id === user_id) {
				return updateInfo
			}
			return item
		})
		cacheStore.updateCacheContactsObj(friendList)
	}

	const deleteFriend = async () => {
		confirmMessage('是否确认删除好友', '删除好友', async () => {
			watchAsyncFn(async () => {
				try {
					const { code } = await RelationService.deleteFriendApi(user_id)
					if (code !== 200) {
						toastMessage('删除好友失败')
						return
					}
					const friendList = cacheStore.cacheContacts?.filter((item) => item?.user_id !== user_id)
					cacheStore.updateCacheContactsObj(friendList)
					// 刷新消息列表
					getRemoteSession()
					// 刷新好友列表
					getFriendList()
				} catch (error) {
					toastMessage('删除好友失败')
				} finally {
					f7router.back()
				}
			}, '删除中...')
		})
	}

	const clearAllmessage = async () => {
		confirmMessage('是否确认删除所有聊天记录', '删除聊天记录', async () => {
			watchAsyncFn(async () => {
				try {
					await messageStore.deleteAllMessage(dialog_id)
					toastMessage('删除聊天记录成功')
				} catch (error) {
					toastMessage('删除聊天记录失败')
				}
			}, '删除中...')
		})
	}

	// 阅后即焚
	const burnAfterRead = async (timeout?: number) => {
		let action: MessageBurnAfterRead
		if (!timeout) {
			action =
				userInfo?.preferences?.open_burn_after_reading === MessageBurnAfterRead.YES
					? MessageBurnAfterRead.NO
					: MessageBurnAfterRead.YES
			timeout = 10
		} else {
			action = MessageBurnAfterRead.YES
		}

		const tips_error = action === MessageBurnAfterRead.YES ? $t('阅后即焚失败') : $t('取消阅后即焚失败')
		updateCache({ open_burn_after_reading_time_out: timeout, open_burn_after_reading: action })
		try {
			const { code } = await RelationService.setBurnApi({ action, user_id, timeout: timeout ?? 10 })
			if (code !== 200) {
				toastMessage(tips_error)
				return
			}
		} catch (error) {
			toastMessage('设置阅后即焚失败')
		}
	}

	// 消息免打扰
	const messageDisturb = async () => {
		const is_silent =
			userInfo?.preferences?.silent_notification === MessageNoDisturb.YES
				? MessageNoDisturb.NO
				: MessageNoDisturb.YES
		const tips_error = is_silent === MessageNoDisturb.YES ? $t('消息免打扰失败') : $t('取消消息免打扰失败')
		updateCache({ silent_notification: is_silent })
		try {
			const { code } = await RelationService.setSilenceApi({ is_silent, user_id })
			if (code !== 200) {
				toastMessage(tips_error)
				return
			}
		} catch (error) {
			toastMessage('设置消息免打扰失败')
		}
	}

	// 黑名单
	const blackList = async () => {
		const is_add = userInfo?.relation_status === RelationStatus.BLACK
		const tips_error = is_add ? $t('移除黑名单失败') : $t('添加黑名单失败')
		updateCache({}, { relation_status: is_add ? RelationStatus.YES : RelationStatus.BLACK })
		try {
			const params = { user_id }
			const { code } = is_add
				? await RelationService.deleteBlackListApi(params)
				: await RelationService.addBlackListApi(params)
			if (code !== 200) return toastMessage(tips_error)
			// 刷新消息列表
			getRemoteSession()
			// 刷新好友列表
			getFriendList()
		} catch (error) {
			toastMessage(tips_error)
		}
	}

	// 设置阅后即焚时间
	const changeTime = async (index: number) => {
		burnAfterRead(times[index].value)
		// watchAsyncFn(async () => {
		// 	try {
		// 		const { code } = await RelationService.setBurnTimeApi({
		// 			friend_id: user_id,
		// 			open_burn_after_reading_time_out: times[index].value
		//         })
		// 		if (code !== 200) return toastMessage('设置失败')
		// 		updateCache({ open_burn_after_reading_time_out: times[index].value })
		// 	} catch (error) {
		// 		toastMessage('设置失败')
		// 	}
		// }, '设置中...')
	}

	const is_burn_after_reading = useMemo(
		() => userInfo?.preferences?.open_burn_after_reading === MessageBurnAfterRead.YES,
		[userInfo?.preferences?.open_burn_after_reading]
	)

	const handlerClick = async (isLabel: boolean = false) => {
		await messageStore.init({
			dialogId: dialog_id ?? 0,
			receiverId: user_id ?? 0,
			isGroup: false,
			receiverInfo: {
				dialog_id: userInfo?.dialog_id,
				dialog_avatar: userInfo?.avatar,
				dialog_name: userInfo?.preferences?.remark ?? userInfo?.nickname
			},
			isLabel
		})

		f7router?.navigate(`/message/${user_id}/${dialog_id}/?is_group=false&dialog_name=${userInfo.nickname}`)
	}

	return (
		<Page className="profile-page" noToolbar onPageBeforeIn={onPageBeforeIn}>
			<Navbar title={$t('用户信息')} backLink className="hidden-navbar-bg" />

			<div className="mb-3 p-4 flex flex-col justify-center items-center">
				<Avatar size={70} src={userInfo?.avatar} />
				<div className="mb-2 flex flex-col items-center">
					<span className="">{`@${userInfo?.nickname || ''}`}</span>
					<span className="">{`${userInfo?.email || ''}`}</span>
				</div>
				<div className="flex my-4 justify-evenly w-full">
					{!is_from_message_page && (
						<div className="size-10  flex flex-col justify-center items-center">
							<div className="mb-2 p-2 rounded-full bg-black bg-opacity-10">
								<Link iconF7="chat_bubble_fill" iconSize={22} onClick={async () => handlerClick()} />
							</div>
							<span className="text-xs">消息</span>
						</div>
					)}
					<div
						className="size-10 flex flex-col justify-center items-center"
						onClick={() => liveRoomStore.call({ recipient: user_id, isGroup: false, video: false })}
					>
						<div className="mb-2 p-2 rounded-full bg-black bg-opacity-10">
							<Icon f7="phone_fill" size={22} />
						</div>
						<span className="text-xs">语音</span>
					</div>
					<div
						className="size-10  flex flex-col justify-center items-center"
						onClick={() => liveRoomStore.call({ recipient: user_id, isGroup: false, video: true })}
					>
						<div className="mb-2 p-2 rounded-full bg-black bg-opacity-10">
							<Icon f7="videocam_fill" size={22} />
						</div>
						<span className="text-xs">视频</span>
					</div>
					<div className="size-10  flex flex-col justify-center items-center" onClick={() => {}}>
						<div className="mb-2 p-2 rounded-full bg-black bg-opacity-10">
							<Link iconF7="tag_fill" iconSize={22} onClick={async () => handlerClick(true)} />
						</div>
						<span className="text-xs">标注</span>
					</div>
				</div>
			</div>

			<List strong outline dividers className="bg-white m-0 mb-3">
				<ListItem
					link={`/user_remark/?remark=${userInfo?.preferences?.remark}&user_id=${userInfo?.user_id}`}
					title={$t('备注')}
					after={userInfo?.preferences?.remark}
				></ListItem>
				<ListItem title={$t('阅后即焚')}>
					<Toggle slot="after" checked={is_burn_after_reading} onChange={() => burnAfterRead()} />
				</ListItem>
				{is_burn_after_reading && (
					<li>
						<ul>
							{times.map((item, index) => (
								<ListItem title={item.label} key={index}>
									<Toggle
										slot="after"
										onChange={() => changeTime(index)}
										checked={
											item.value ===
											(userInfo?.preferences?.open_burn_after_reading_time_out ?? 10)
										}
									/>
								</ListItem>
							))}
						</ul>
					</li>
				)}

				<ListItem title={$t('消息免打扰')}>
					<Toggle
						slot="after"
						checked={userInfo?.preferences?.silent_notification === MessageNoDisturb.YES}
						onChange={messageDisturb}
					/>
				</ListItem>
				<ListItem title={$t('添加到黑名单')}>
					<Toggle
						slot="after"
						checked={userInfo?.relation_status === RelationStatus.BLACK}
						onChange={blackList}
					/>
				</ListItem>
			</List>

			<List strong outline dividers className="bg-white m-0 mb-3">
				<ListButton color="red" onClick={clearAllmessage}>
					{$t('清除聊天记录')}
				</ListButton>
				<ListButton color="red" title={$t('删除好友')} onClick={deleteFriend}></ListButton>
			</List>
		</Page>
	)
}

export default Profile
