import { Icon, Link, List, ListButton, ListItem, Navbar, Page, Toggle, f7 } from 'framework7-react'
import { useMemo, useRef, useState } from 'react'
import { isEqual } from 'lodash-es'

import { $t, MessageBurnAfterRead, MessageNoDisturb, RelationStatus } from '@/shared'
import UserStore from '@/db/user'
import UserService from '@/api/user'
import RelationService from '@/api/relation'
import { useStateStore } from '@/stores/state'
import { useMessageStore } from '@/stores/message'
import { useLiveRoomStore } from '@/stores/liveRoom'

const Profile: React.FC<RouterProps> = ({ f7route, f7router }) => {
	const user_id = f7route.params.user_id as string
	const is_from_message_page = f7route.query.from_page === 'message'
	const dialog_id = Number(f7route.query.dialog_id) ?? 0

	const pageRef = useRef<{ el: HTMLDivElement | null }>({ el: null })

	const [userInfo, setUserInfo] = useState<any>({})

	const { updateContacts } = useStateStore()
	const { clearMessages } = useMessageStore()
	const liveRoomStore = useLiveRoomStore()

	const onPageInit = async () => {
		await updateUserInfo(true)
	}

	const updateUserInfo = async (request: boolean = true) => {
		const user = await UserStore.findOneById(UserStore.tables.friends, 'user_id', user_id)
		setUserInfo(user)

		const index = times.findIndex((item) => item.value === user?.preferences?.open_burn_after_reading_time_out)
		if (index !== -1) {
			times[index].checked = true
			setTimes([...times])
		}

		// 如不需要从服务器上获取数据，直接返回
		if (user && !request) return

		const { data } = await UserService.getUserInfoApi({ user_id })

		const updateData = { ...user, ...data }

		// 比较两个对象是否相同
		if (isEqual(user, updateData)) return

		setUserInfo(updateData)
		user
			? await UserStore.update(UserStore.tables.friends, 'user_id', user_id, updateData)
			: await UserStore.add(UserStore.tables.friends, { ...updateData, dialog_id, group: '#' })
	}

	// 呼叫
	// const { call, updateEnablesVideo } = useCallStore()
	// const callUser = async (enableVideo: boolean) => {
	// 	try {
	// 		// 检查设备是否可用
	// 		await hasMike()
	// 		enableVideo && (await hasCamera())
	// 		f7.dialog.preloader($t('呼叫中...'))
	// 		// 是否开启摄像头
	// 		updateEnablesVideo(enableVideo)
	// 		await call({ userInfo })
	// 		f7.dialog.close()
	// 		f7router.navigate('/call/')
	// 	} catch (error: any) {
	// 		console.log(error?.code, error?.code === 8)
	// 		console.dir(error)
	// 		if (error?.code === 8) {
	// 			f7.dialog.alert($t('当前媒体设备不可用，无法接听来电'))
	// 			return
	// 		}
	// 		f7.dialog.alert($t(error?.message || '呼叫失败...'))
	// 	} finally {
	// 		f7.dialog.close()
	// 	}
	// }

	const deleteFriend = async () => {
		f7.dialog.confirm($t('是否确认删除好友?'), $t('删除好友'), async () => {
			try {
				f7.dialog.preloader($t('删除中...'))
				const { code } = await RelationService.deleteFriendApi(user_id)
				if (code !== 200) {
					f7.dialog.alert($t('删除好友失败'))
					return
				}
				updateContacts(true)
				// 删除数据库中的好友
				await UserStore.delete(UserStore.tables.friends, 'user_id', user_id)
			} catch (error) {
				console.log('删除好友失败', error)
				return f7.dialog.alert($t('删除好友失败'))
			} finally {
				f7.dialog.close()
				f7router.back()
			}
		})
	}

	const clearAllmessage = async () => {
		f7.dialog.confirm($t('是否确认删除所有聊天记录?'), $t('删除聊天记录'), async () => {
			try {
				f7.dialog.preloader($t('删除中...'))
				await UserStore.delete(UserStore.tables.messages, 'dialog_id', userInfo.dialog_id)
				await clearMessages()
				f7.dialog.alert($t('删除聊天记录成功'))
			} catch (error) {
				return f7.dialog.alert($t('删除聊天记录失败'))
			} finally {
				f7.dialog.close()
			}
		})
	}

	// 阅后即焚
	const burnAfterRead = async () => {
		const action =
			userInfo?.preferences?.open_burn_after_reading === MessageBurnAfterRead.YES
				? MessageBurnAfterRead.NO
				: MessageBurnAfterRead.YES

		// const tips = action === MessageBurnAfterRead.YES ? $t('是否确认阅后即焚?') : $t('是否确认取消阅后即焚?')
		const tips_error = action === MessageBurnAfterRead.YES ? $t('阅后即焚失败') : $t('取消阅后即焚失败')

		// f7.dialog.confirm(tips, $t('阅后即焚'), async () => {
		try {
			f7.dialog.preloader($t('设置中...'))
			const { code } = await RelationService.setBurnApi({ action, user_id })
			if (code !== 200) {
				f7.dialog.alert(tips_error)
				return
			}
			await RelationService.setBurnTimeApi({
				friend_id: user_id,
				open_burn_after_reading_time_out: 10
			})

			// 更新本地数据库
			await UserStore.update(UserStore.tables.friends, 'user_id', user_id, {
				preferences: {
					...userInfo?.preferences,
					open_burn_after_reading: action,
					open_burn_after_reading_time_out: 10
				}
			})
			await updateUserInfo(false)
		} catch (error) {
			return f7.dialog.alert(tips_error)
		} finally {
			f7.dialog.close()
		}
		// })
	}

	// 消息免打扰
	const messageDisturb = async () => {
		const is_silent =
			userInfo?.preferences?.silent_notification === MessageNoDisturb.YES
				? MessageNoDisturb.NO
				: MessageNoDisturb.YES

		// const tips = is_silent === MessageNoDisturb.YES ? $t('是否确认消息免打扰?') : $t('是否确认取消消息免打扰?')
		const tips_error = is_silent === MessageNoDisturb.YES ? $t('消息免打扰失败') : $t('取消消息免打扰失败')

		// f7.dialog.confirm(tips, $t('消息免打扰'), async () => {
		try {
			f7.dialog.preloader($t('消息免打扰中...'))
			const { code } = await RelationService.setSilenceApi({ is_silent, user_id })
			if (code !== 200) {
				f7.dialog.alert(tips_error)
				return
			}
			// 更新本地数据库
			await UserStore.update(UserStore.tables.friends, 'user_id', user_id, {
				preferences: { ...userInfo?.preferences, silent_notification: is_silent }
			})
			await updateUserInfo(false)
		} catch (error) {
			return f7.dialog.alert(tips_error)
		} finally {
			f7.dialog.close()
		}
		// })
	}

	// 展示对话
	// const showDialog = async (event?: any) => {
	// 	console.log('delete', event)
	// 	// const dialog_id = event?.target?.dataset?.dialogId
	// 	// await RelationService.showDialogApi({ dialog_id, action: 0 })
	// }

	// 黑名单
	const blackList = async () => {
		console.log('userInfo', userInfo)

		const is_add = userInfo?.relation_status === RelationStatus.BLACK

		// const tips = is_add ? $t('是否确认取消添加到黑名单?') : $t('是否确认添加到黑名单?')
		const tips_error = is_add ? $t('移除黑名单失败') : $t('添加黑名单失败')

		// f7.dialog.confirm(tips, $t('加入黑名单'), async () => {
		try {
			f7.dialog.preloader(is_add ? $t('移除黑名单中...') : $t('加入黑名单中...'))
			const params = { user_id }

			const { code } = is_add
				? await RelationService.deleteBlackListApi(params)
				: await RelationService.addBlackListApi(params)

			if (code !== 200) {
				f7.dialog.alert(tips_error)
				return
			}

			// 更新本地数据库
			await UserStore.update(UserStore.tables.friends, 'user_id', user_id, {
				relation_status: is_add ? RelationStatus.YES : RelationStatus.BLACK
			})
			await updateUserInfo(false)
		} catch (error) {
			return f7.dialog.alert(tips_error)
		} finally {
			f7.dialog.close()
		}
		// })
	}

	const [times, setTimes] = useState<{ label: string; value: number; checked?: boolean }[]>([
		{ label: $t('10秒'), value: 10, checked: false },
		{ label: $t('1分钟'), value: 60, checked: false },
		// { label: $t('5分钟'), value: 300, checked: false },
		{ label: $t('10分钟'), value: 600, checked: false }
	])

	const changeTime = async (index: number) => {
		const items = [...times]
		items.forEach((item) => {
			item.checked = false
		})
		items[index].checked = true
		setTimes(items)

		const { code } = await RelationService.setBurnTimeApi({
			friend_id: user_id,
			open_burn_after_reading_time_out: items[index].value
		})

		if (code === 200) {
			// 更新本地数据库
			await UserStore.update(UserStore.tables.friends, 'user_id', user_id, {
				preferences: { ...userInfo?.preferences, open_burn_after_reading_time_out: items[index].value }
			})
			await updateUserInfo(false)
		}
	}

	const is_burn_after_reading = useMemo(
		() => userInfo?.preferences?.open_burn_after_reading === MessageBurnAfterRead.YES,
		[userInfo?.preferences?.open_burn_after_reading]
	)

	return (
		<Page ref={pageRef} className="profile-page bg-bgTertiary" noToolbar onPageInit={onPageInit}>
			<Navbar title={$t('用户信息')} backLink className="bg-bgPrimary hidden-navbar-bg" />

			<div className="mb-3 p-4 bg-white flex flex-col justify-center items-center">
				<img className="mb-2 size-20 rounded-full bg-black bg-opacity-10" src={userInfo?.avatar} alt="" />
				<div className="mb-2 flex flex-col items-center">
					<span className="">{`@${userInfo?.nickname || ''}`}</span>
					<span className="">{`${userInfo?.email || ''}`}</span>
				</div>
				<div className="flex my-4 justify-evenly w-full">
					{!is_from_message_page && (
						<div className="size-10  flex flex-col justify-center items-center">
							<div className="mb-2 p-2 rounded-full bg-black bg-opacity-10">
								<Link
									iconF7="chat_bubble_fill"
									iconSize={22}
									href={`/message/${user_id}/${userInfo?.dialog_id}/?is_group=false&dialog_name=${userInfo?.nickname}`}
								/>
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
							<Link iconF7="tag_fill" iconSize={22} />
						</div>
						<span className="text-xs">标注</span>
					</div>
					{/* <div className="size-10 flex flex-col justify-center items-center" onClick={() => {}}>
						<div className="mb-2 p-2 rounded-full bg-black bg-opacity-10">
							<Link iconF7="ellipsis" iconSize={22} popoverOpen=".popover-menu" />
						</div>
						<span className="text-xs">更多</span>
					</div> */}
				</div>
			</div>

			<List strong outline dividers className="bg-white m-0 mb-3">
				<ListItem title={$t('阅后即焚')}>
					<Toggle slot="after" checked={is_burn_after_reading} onChange={burnAfterRead} />
				</ListItem>
				{/* <ListItem title={$t('自焚时间')} /> */}
				{is_burn_after_reading && (
					<li>
						<ul>
							{times.map((item, index) => (
								<ListItem title={item.label} key={index}>
									<Toggle slot="after" onChange={() => changeTime(index)} checked={item.checked} />
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
				{/* TODO: */}
				{/* <ListItem title={$t('显示对话')}>
						<Toggle slot="after" checked={false} onChange={showDialog} />
					</ListItem> */}
				<ListItem title={$t('添加到黑名单')}>
					<Toggle
						slot="after"
						checked={userInfo?.relation_status === RelationStatus.BLACK}
						onChange={blackList}
					/>
				</ListItem>
				<ListItem link='/user_remark/' title={$t('备注')}>

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
