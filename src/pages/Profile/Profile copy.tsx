import { Link, List, ListButton, ListItem, Navbar, Page, Toggle, f7 } from 'framework7-react'
import { useRef, useState } from 'react'
import { isEqual } from 'lodash-es'

import { $t, MessageBurnAfterRead, MessageNoDisturb, RelationStatus, USER_ID } from '@/shared'
import UserStore from '@/db/user'
import UserService from '@/api/user'
import './Profile.scss'
import { useCallStore } from '@/stores/call'
// import { useCallStore } from '@/stores/call'
import RelationService from '@/api/relation'
import { useStateStore } from '@/stores/state'
import { useMessageStore } from '@/stores/message'
import { getCookie } from '@/utils/cookie'
import { hasCamera, hasMike } from '@/utils/media'

const userId = getCookie(USER_ID) || ''

const Profile: React.FC<RouterProps> = ({ f7route, f7router }) => {
	const user_id = f7route.params.user_id as string
	const is_from_message_page = f7route.query.from_page === 'message'

	const pageRef = useRef<{ el: HTMLDivElement | null }>({ el: null })
	const profileAvatarRef = useRef<HTMLDivElement | null>(null)

	const [userInfo, setUserInfo] = useState<any>({})

	const { updateContacts } = useStateStore()
	const { clearMessages } = useMessageStore()

	// 页面安装时将页面滚动到头像大小的一半
	const onPageInit = async () => {
		const profileAvatarHeight = profileAvatarRef.current!.offsetHeight
		pageRef.current.el!.querySelector('.page-content')!.scrollTop = profileAvatarHeight / 2
		await updateUserInfo(true)
	}

	const updateUserInfo = async (request: boolean = true) => {
		const user = await UserStore.findOneById(UserStore.tables.friends, 'user_id', user_id)
		setUserInfo(user)

		// 如不需要从服务器上获取数据，直接返回
		if (!request) return

		const { data } = await UserService.getUserInfoApi({ user_id })

		const updateData = { ...user, ...data }

		// 比较两个对象是否相同
		if (isEqual(user, updateData)) return

		setUserInfo(updateData)
		await UserStore.update(UserStore.tables.friends, 'user_id', user_id, updateData)
	}

	// 呼叫
	const { call, updateEnablesVideo } = useCallStore()
	const callUser = async (enableVideo: boolean) => {
		try {
			// 检查设备是否可用
			await hasMike()
			enableVideo && (await hasCamera())
			f7.dialog.preloader($t('呼叫中...'))
			// 是否开启摄像头
			updateEnablesVideo(enableVideo)
			await call({ userInfo })
			f7.dialog.close()
			f7router.navigate('/call/')
		} catch (error: any) {
			console.log(error?.code, error?.code === 8)
			console.dir(error)
			if (error?.code === 8) {
				f7.dialog.alert($t('当前媒体设备不可用，无法接听来电'))
				return
			}
			f7.dialog.alert($t(error?.message || '呼叫失败...'))
		}
	}

	const deleteFriend = async () => {
		f7.dialog.confirm($t('是否确认删除好友?'), $t('删除好友'), async () => {
			try {
				f7.dialog.preloader($t('删除中...'))
				const { code } = await RelationService.deleteFriendApi(user_id)
				if (code !== 200) return f7.dialog.alert($t('删除好友失败'))
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

		const tips = action === MessageBurnAfterRead.YES ? $t('是否确认阅后即焚?') : $t('是否确认取消阅后即焚?')
		const tips_error = action === MessageBurnAfterRead.YES ? $t('阅后即焚失败') : $t('取消阅后即焚失败')

		f7.dialog.confirm(tips, $t('阅后即焚'), async () => {
			try {
				f7.dialog.preloader($t('设置中...'))
				const { code } = await RelationService.setBurnApi({ action, user_id })
				if (code !== 200) return f7.dialog.alert(tips_error)
				// 更新本地数据库
				await UserStore.update(UserStore.tables.friends, 'user_id', user_id, {
					preferences: { ...userInfo?.preferences, open_burn_after_reading: action }
				})
				await updateUserInfo(false)
			} catch (error) {
				return f7.dialog.alert(tips_error)
			} finally {
				f7.dialog.close()
			}
		})
	}

	// 消息免打扰
	const messageDisturb = async () => {
		const is_silent =
			userInfo?.preferences?.silent_notification === MessageNoDisturb.YES
				? MessageNoDisturb.NO
				: MessageNoDisturb.YES

		const tips = is_silent === MessageNoDisturb.YES ? $t('是否确认消息免打扰?') : $t('是否确认取消消息免打扰?')
		const tips_error = is_silent === MessageNoDisturb.YES ? $t('消息免打扰失败') : $t('取消消息免打扰失败')

		f7.dialog.confirm(tips, $t('消息免打扰'), async () => {
			try {
				f7.dialog.preloader($t('消息免打扰中...'))
				const { code } = await RelationService.setSilenceApi({ is_silent, user_id })
				if (code !== 200) return f7.dialog.alert(tips_error)
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
		})
	}

	// 展示对话
	// const showDialog = async (event?: any) => {
	// 	console.log('delete', event)
	// 	// const dialog_id = event?.target?.dataset?.dialogId
	// 	// await RelationService.showDialogApi({ dialog_id, action: 0 })
	// }

	// 黑名单
	const blackList = async () => {
		const is_add = userInfo?.preferences?.blacklist === RelationStatus.BLACK

		const tips = is_add ? $t('是否确认取消添加到黑名单?') : $t('是否确认添加到黑名单?')
		const tips_error = is_add ? $t('移除黑名单失败') : $t('添加黑名单失败')

		f7.dialog.confirm(tips, $t('加入黑名单'), async () => {
			try {
				f7.dialog.preloader($t('加入黑名单中...'))
				const params = { friend_id: user_id, user_id: userId }
				const { code } = is_add
					? await RelationService.deleteBlackListApi(params)
					: await RelationService.addBlackListApi(params)

				if (code !== 200) return f7.dialog.alert(tips_error)

				// 更新本地数据库
				await UserStore.update(UserStore.tables.friends, 'user_id', user_id, {
					preferences: {
						...userInfo?.preferences,
						blacklist: is_add ? RelationStatus.YES : RelationStatus.BLACK
					}
				})
				await updateUserInfo(false)
			} catch (error) {
				return f7.dialog.alert(tips_error)
			} finally {
				f7.dialog.close()
			}
		})
	}

	return (
		<Page ref={pageRef} className="profile-page bg-bgTertiary" noToolbar onPageInit={onPageInit}>
			<Navbar title={$t('用户信息')} backLink className="bg-bgPrimary hidden-navbar-bg" />
			<div className="profile-avatar-block" ref={profileAvatarRef}>
				<img src={userInfo?.avatar} alt="" />
			</div>
			<div className="profile-content bg-gray-100">
				<List strong outline dividers mediaList className="no-margin-top m-0 mb-3 bg-white">
					<ListItem title={userInfo?.name} text={userInfo?.nickname}>
						<div slot="after" className="profile-actions-links">
							{!is_from_message_page && (
								<Link
									iconF7="chat_bubble_fill"
									href={`/message/${f7route.params.id}/${userInfo?.dialog_id}/?is_group=false&dialog_name=${userInfo?.nickname}`}
								/>
							)}
							<Link iconF7="videocam_fill" onClick={() => callUser(true)} />
							<Link iconF7="phone_fill" onClick={() => callUser(false)} />
						</div>
					</ListItem>
					<ListItem subtitle={userInfo?.signature} text={userInfo?.email} />
				</List>

				<List strong outline dividers className="bg-white m-0 mb-3">
					<ListItem title={$t('阅后即焚')}>
						<Toggle
							slot="after"
							checked={userInfo?.preferences?.open_burn_after_reading === MessageBurnAfterRead.YES}
							onChange={burnAfterRead}
						/>
					</ListItem>
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
				</List>

				<List strong outline dividers className="bg-white m-0 mb-3">
					<ListButton color="red" onClick={clearAllmessage}>
						{$t('清除聊天记录')}
					</ListButton>
					<ListButton color="red" title={$t('删除好友')} onClick={deleteFriend}></ListButton>
				</List>
			</div>
		</Page>
	)
}

export default Profile
