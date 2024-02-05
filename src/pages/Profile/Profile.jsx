import React, { useRef, useEffect, useState } from 'react'
import { List, ListItem, Navbar, Link, Page, f7, Toggle, ListButton } from 'framework7-react'
import './Profile.less'
// import ListColorIcon from '@/components/ListColorIcon'
// import { contacts } from '@/data'
import { $t } from '@/i18n'
import { getUserInfoApi } from '@/api/user'
import { deleteFriendApi, addBlackListApi, deleteBlackListApi, setSilenceApi } from '@/api/relation'
import PropTypes from 'prop-types'
// import { StarFill } from 'framework7-icons/react'
import { Dialog, Toast } from 'antd-mobile'

import userService, { dbService } from '@/db'

Profile.propTypes = {
	f7route: PropTypes.object,
	f7router: PropTypes.object
}

const isChat = (is_chat) => {
	return Number(is_chat) === 1
}

export default function Profile(props) {
	const { f7route, f7router } = props

	const { is_chat = 0 } = f7route.query
	const [info, setInfo] = useState({})

	const pageRef = useRef(null)
	const profileAvatarRef = useRef(null)

	// 是否是黑名单
	const [isBlackList, setIsBlackList] = useState(false)
	// 是否消息免打扰
	const [silence, setSilence] = useState(false)
	// 是否阅后即焚
	const [burnAfterRead, setBurnAfterRead] = useState(false)
	// 是否是好友
	const [isFriend, setIsFriend] = useState(false)

	const text = {
		tips: $t('您确定要删除好友吗？'),
		btn_agree: $t('同意'),
		btn_refuse: $t('拒绝'),
		backTips: $t('加入黑名单后，你将不再收到对方的消息'),
		delSuccess: $t('删除成功'),
		blackSuccess: $t('添加黑名单成功'),
		blackFail: $t('添加黑名单失败'),
		romoveBlackTips: $t('您确定要移除黑名单吗？'),
		romoveBlackSuccess: $t('移除黑名单成功'),
		romoveBlackFail: $t('移除黑名单失败')
	}

	// 页面安装时将页面滚动到头像大小的一半
	useEffect(() => {
		const getUserInfo = async () => {
			let isBurnAfterRead = 0
			let isSilence = 0
			let status = 0
			let isFriend = false
			let preferences = null
			let user = null
			try {
				const user = await userService.findOneById(dbService.TABLES.FRIENDS_LIST, f7route.params.id, 'user_id')

				console.log('user', user)
				if (user && user?.setting) {
					setInfo(user)
					return
				}

				const res = await getUserInfoApi({ user_id: f7route.params.id, type: 1 })
				if (res.code !== 200) return

				setInfo(res.data)

				preferences = res.data?.preferences
				status = res.data?.relation_status || 1
				isBurnAfterRead = preferences?.open_burn_after_reading || 0
				isSilence = preferences?.silent_notification || 0
				isFriend = preferences ? true : false

				// console.log('f7route.params.id', f7route.params.id, isFriend)
			} catch (error) {
				console.log(error)
			} finally {
				setIsBlackList(status === 2)
				setBurnAfterRead(isBurnAfterRead === 1)
				setSilence(isSilence == 1)
				setIsFriend(isFriend)
				isFriend &&
					(await userService.update(userService.TABLES.FRIENDS_LIST, f7route.params.id, {
						...user,
						setting: preferences
					}),
					'user_id')
			}
		}
		getUserInfo()

		const profileAvatarHeight = profileAvatarRef.current.offsetHeight
		pageRef.current.el.querySelector('.page-content').scrollTop = profileAvatarHeight / 2

		// console.log('profileAvatarHeight', info)
	}, [])

	const deleteFriend = () => {
		// 确认提示
		f7.dialog.confirm(text.tips, async () => {
			const res = await deleteFriendApi({ user_id: f7route.params.id })
			if (res.code !== 200) return
			// 删除本地存储
			await dbService.delete(dbService.TABLES.CONTACTS, f7route.params.id)
			f7.dialog.alert(text.delSuccess, () => {
				f7router.back()
			})
		})
	}

	const onBlackListChange = async () => {
		const isBlack = !isBlackList
		try {
			isBlack
				? await Dialog.confirm({
						content: $t('开启后，将不再接收对方的消息'),
						closeOnAction: true,
						onConfirm: async () => {
							const { code } = await addBlackListApi({ user_id: f7route.params.id })
							code === 200 && setIsBlackList(isBlack)
						}
					})
				: await deleteBlackListApi({ user_id: f7route.params.id })
		} catch (error) {
			console.error('添加黑名单失败：', error)
			return Toast.show($t('添加黑名单失败'))
		} finally {
			!isBlack && setIsBlackList(isBlack)
		}
	}

	// 阅后即焚
	const onBurnAfterReadChange = async () => {
		const isBurnAfterRead = !burnAfterRead
		try {
			isBurnAfterRead
				? await Dialog.confirm({
						content: isBurnAfterRead
							? $t('开启后，对方阅读消息后会自动销毁')
							: $t('关闭后，对方阅读消息后会保留'),
						closeOnAction: true,
						onConfirm: async () => {
							// TODO: 对接全局设置接口
							setBurnAfterRead(isBurnAfterRead)
						}
					})
				: setBurnAfterRead(isBurnAfterRead)
		} catch (error) {
			console.error('设置阅后即焚失败', error)
			return Toast.show($t('设置失败'))
		} finally {
			!isBurnAfterRead && setBurnAfterRead(isBurnAfterRead)
		}
	}

	// 消息免打扰
	const onSilenceChange = async () => {
		const isSilence = !silence
		try {
			const setSilenceChange = async () =>
				await setSilenceApi({ user_id: f7route.params.id, is_silent: isSilence ? 1 : 0 })

			isSilence
				? await Dialog.confirm({
						content: $t('开启后，将不再收到对方消息通知'),
						closeOnAction: true,
						onConfirm: async () => {
							const { code } = await setSilenceChange()
							if (code !== 200) return Toast.show($t('设置失败'))
							setSilence(isSilence)
						}
					})
				: await setSilenceChange()
		} catch (error) {
			console.error('设置消息免打扰失败', error)
			Toast.show($t('设置失败'))
			return
		} finally {
			!isSilence && setSilence(isSilence)
		}
	}

	// 删除所有聊天记录
	const deleteAllChat = () => {
		try {
			Dialog.confirm({
				content: $t('确定要删除所有聊天记录吗？'),
				closeOnAction: true,
				onConfirm: async () => {
					console.log('删除所有聊天记录', info.dialog_id, userService.TABLES.USER_MSGS)
					const reslut = await userService.delete(userService.TABLES.USER_MSGS, info.dialog_id, 'dialog_id')
					if (!reslut) return Toast.show($t('删除失败'))
					Toast.show($t('删除成功'))
				}
			})
		} catch (error) {
			console.error('设置消息免打扰失败', error)
			return Toast.show($t('删除失败'))
		}
	}

	return (
		<Page ref={pageRef} className="profile-page bg-gray-100" noToolbar>
			<Navbar title={$t('用户信息')} backLink="Back" backLinkShowText="" />
			<div className="profile-avatar-block" ref={profileAvatarRef}>
				<img src={info?.avatar} alt="" />
			</div>
			<div className="profile-content">
				<List strong outline dividers mediaList className="no-margin-top m-0 mb-3 bg-white">
					<ListItem title={info?.name} text={info?.nick_name || info?.nickname}>
						{!isChat(is_chat) && (
							<div slot="after" className="profile-actions-links">
								<Link
									iconF7="chat_bubble_fill"
									href={`/chats/${f7route.params.id}/?dialog_id=${info?.dialog_id}`}
								/>
								<Link iconF7="camera_fill" />
								<Link iconF7="phone_fill" />
							</div>
						)}
					</ListItem>
					<ListItem subtitle={info?.signature} text={info?.email} />
				</List>

				{/* <List strong outline dividers>
					<ListItem link title="Mute" after="No">
						<ListColorIcon color="#35C759" icon="speaker_3_fill" slot="media" />
					</ListItem>
					<ListItem link title="Wallpaper & Sound">
						<ListColorIcon color="#EC72D7" icon="camera_filters" slot="media" />
					</ListItem>
					<ListItem link title="Save to Camera Roll" after="Default">
						<ListColorIcon color="#FFC601" icon="square_arrow_down_fill" slot="media" />
					</ListItem>
				</List> */}
				{/* 
				<List strong outline dividers>
					<ListItem link title={$t('媒体、链接和文档')} after="1 758">
						<ListColorIcon color="#007BFD" icon="photo" slot="media" />
					</ListItem>
					<ListItem link title={$t('聊天记录')} after="3">
						<StarFill color="#FFC601" slot="media" />
					</ListItem>
					<ListItem link title="Chat Search">
					<ListColorIcon color="#FF8E35" icon="search" slot="media" />
					</ListItem>
				</List> */}

				{/* <List strong outline dividers>
					<ListItem link title="Mute" after="No">
						<ListColorIcon color="#35C759" icon="speaker_3_fill" slot="media" />
					</ListItem>
					<ListItem link title="Wallpaper & Sound">
						<ListColorIcon color="#EC72D7" icon="camera_filters" slot="media" />
					</ListItem>
					<ListItem link title="Save to Camera Roll" after="Default">
						<ListColorIcon color="#FFC601" icon="square_arrow_down_fill" slot="media" />
					</ListItem>
				</List> */}

				<List strong outline dividers className="bg-white m-0 mb-3">
					<ListItem title={$t('阅后即焚')}>
						<Toggle slot="after" onToggleChange={onBurnAfterReadChange} checked={burnAfterRead} />
					</ListItem>
					<ListItem title={$t('消息免打扰')}>
						<Toggle slot="after" onToggleChange={onSilenceChange} checked={silence} />
					</ListItem>
					<ListItem title={$t('添加到黑名单')}>
						<Toggle slot="after" onToggleChange={onBlackListChange} checked={isBlackList} />
					</ListItem>
				</List>

				<List strong outline dividers className="bg-white m-0 mb-3">
					<ListButton color="red" onClick={deleteAllChat}>
						{$t('清除聊天记录')}
					</ListButton>
					{info?.preferences ? (
						<ListButton color="red" onClick={deleteFriend} title={$t('删除好友')}></ListButton>
					) : (
						<ListButton onClick={deleteFriend}>{$t('添加好友')}</ListButton>
					)}
				</List>
			</div>
		</Page>
	)
}
