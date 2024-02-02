import React, { useRef, useEffect, useState } from 'react'
import { List, ListItem, Navbar, Link, Page, f7, Toggle, ListButton } from 'framework7-react'
import './Profile.less'
// import ListColorIcon from '@/components/ListColorIcon'
// import { contacts } from '@/data'
import { $t } from '@/i18n'
import { getUserInfoApi } from '@/api/user'
import { deleteFriendApi, addBlackListApi, deleteBlackListApi } from '@/api/relation'
import PropTypes from 'prop-types'
// import { StarFill } from 'framework7-icons/react'

import userService, { dbService } from '@/db'

Profile.propTypes = {
	f7route: PropTypes.object,
	f7router: PropTypes.object
}

export default function Profile(props) {
	const { f7route, f7router } = props

	const [info, setInfo] = useState({})

	const pageRef = useRef(null)
	const profileAvatarRef = useRef(null)

	const [isBlackList, setIsBlackList] = useState(false)

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
			const user = await userService.findOneById(dbService.TABLES.FRIENDS_LIST, f7route.params.id, 'user_id')

			if (user) {
				setInfo(user)
				return
			}

			const res = await getUserInfoApi({ user_id: f7route.params.id, type: 1 })
			// console.log('获取用户信息', res)
			if (res.code !== 200) return
			const status = res.data?.relation_status || 1
			setIsBlackList(status === 2)
			setInfo(res.data)
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

	const addBlackList = () => {
		f7.dialog.confirm(
			text.backTips,
			async () => {
				try {
					const res = await addBlackListApi({ user_id: f7route.params.id })
					if (res.code !== 200) {
						f7.dialog.alert(res?.msg || text.blackFail)
						setIsBlackList(false)
						return
					}
				} catch {
					f7.dialog.alert(text.blackFail)
				}
			},
			() => setIsBlackList(false)
		)
	}

	const deleteBlackList = async () => {
		f7.dialog.confirm(
			text.romoveBlackTips,
			async () => {
				try {
					const res = await deleteBlackListApi({ user_id: f7route.params.id })
					if (res.code !== 200) {
						f7.dialog.alert(res?.msg)
						setIsBlackList(true)
						return
					}
				} catch {
					f7.dialog.alert(text.romoveBlackFail)
				}
			},
			() => setIsBlackList(true)
		)
	}

	const onToggleChange = () => {
		setIsBlackList(() => {
			const isblack = !isBlackList
			isblack ? addBlackList() : deleteBlackList()
			return isblack
		})
	}

	return (
		<Page ref={pageRef} className="profile-page" noToolbar>
			<Navbar title={$t('用户信息')} backLink="Back" backLinkShowText="" />
			<div className="profile-avatar-block" ref={profileAvatarRef}>
				<img src={info?.avatar} alt="" />
			</div>
			<div className="profile-content">
				<List strong outline dividers mediaList className="no-margin-top">
					<ListItem title={info?.name} text={info?.nick_name || info?.nickname}>
						<div slot="after" className="profile-actions-links">
							<Link
								iconF7="chat_bubble_fill"
								href={`/chats/${f7route.params.id}/?dialog_id=${info?.dialog_id}`}
							/>
							{/* <Link iconF7="camera_fill" /> */}
							{/* <Link iconF7="phone_fill" /> */}
						</div>
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

				{/* <List strong outline dividers>
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

				<List strong outline dividers>
					<ListItem title={$t('阅后即焚')}>
						<Toggle slot="after" onToggleChange={onToggleChange} checked={isBlackList} />
					</ListItem>
					<ListButton color="red">{$t('清除聊天记录')}</ListButton>
				</List>

				<List strong outline dividers>
					<ListItem>
						<span onClick={deleteFriend} slot="title">
							{$t('添加到黑名单')}
						</span>
						<Toggle slot="after" onToggleChange={onToggleChange} checked={isBlackList} />
					</ListItem>

					<ListItem onClick={deleteFriend}>
						<span slot="title" className="text-red-500">
							{$t('删除好友')}
						</span>
					</ListItem>
				</List>
			</div>
		</Page>
	)
}
