import React, { useRef, useEffect, useState } from 'react'
import { List, ListItem, Navbar, Link, Page, ListButton, f7 } from 'framework7-react'
import './Profile.less'
// import ListColorIcon from '@/components/ListColorIcon'
// import { contacts } from '@/data'
import { $t } from '@/i18n'
import { getUserInfoApi } from '@/api/user'
import { deleteFriendApi, addBlackListApi } from '@/api/relation'
import PropTypes from 'prop-types'

import { dbService } from '@/db'

Profile.propTypes = {
	f7route: PropTypes.object,
	f7router: PropTypes.object
}

export default function Profile(props) {
	const { f7route, f7router } = props

	const [info, setInfo] = useState({})

	const pageRef = useRef(null)
	const profileAvatarRef = useRef(null)

	// 页面安装时将页面滚动到头像大小的一半
	useEffect(() => {
		const getUserInfo = async () => {
			const res = await getUserInfoApi({ user_id: f7route.params.id, type: 1 })
			console.log('获取用户信息', res)
			if (res.code !== 200) return
			setInfo(res.data)
		}
		getUserInfo()

		const profileAvatarHeight = profileAvatarRef.current.offsetHeight
		pageRef.current.el.querySelector('.page-content').scrollTop = profileAvatarHeight / 2
	}, [])

	const text = {
		tips: $t('您确定要删除好友吗？'),
		btn_agree: $t('同意'),
		btn_refuse: $t('拒绝'),
		backTips: $t('加入黑名单后，你将不再收到对方的消息'),
		delSuccess: $t('删除成功'),
		blackSuccess: $t('添加黑名单成功')
	}

	const deleteFriend = () => {
		// 确认提示
		f7.dialog.confirm(text.tips, async () => {
			const res = await deleteFriendApi({ user_id: f7route.params.id })
			if (res.code !== 200) return
			// 删除本地存储
			// await WebDB.contacts.where('user_id').equals(f7route.params.id).delete()
			await dbService.delete(dbService.TABLES.CONTACTS, f7route.params.id)
			f7.dialog.alert(text.delSuccess, () => {
				f7router.back()
			})
		})
	}

	const addBlackList = () => {
		f7.dialog.confirm(text.backTips, async () => {
			const res = await addBlackListApi({ user_id: f7route.params.id })
			if (res.code !== 200) return
			console.log(res)
			// await dbService.delete(dbService.TABLES.CONTACTS, f7route.params.id)
			f7.dialog.alert(text.blackSuccess, () => {
				f7router.back()
			})
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
					<ListItem title={info?.name} text={info?.nick_name}>
						<div slot="after" className="profile-actions-links">
							<Link iconF7="chat_bubble_fill" />
							{/* <Link iconF7="camera_fill" /> */}
							{/* <Link iconF7="phone_fill" /> */}
						</div>
					</ListItem>
					<ListItem subtitle={info?.status} text={info?.email} />
				</List>
				{/* <List strong outline dividers>
					<ListItem link title={$t('媒体、链接和文档')} after="1 758">
						<ListColorIcon color="#007BFD" icon="photo" slot="media" />
					</ListItem>
					<ListItem link title="Starred Messages" after="3">
						<ListColorIcon color="#FFC601" icon="star_fill" slot="media" />
					</ListItem>
					<ListItem link title="Chat Search">
						<ListColorIcon color="#FF8E35" icon="search" slot="media" />
					</ListItem>
				</List>

				<List strong outline dividers>
					<ListItem link title="Mute" after="No">
						<ListColorIcon color="#35C759" icon="speaker_3_fill" slot="media" />
					</ListItem>
					<ListItem link title="Wallpaper & Sound">
						<ListColorIcon color="#EC72D7" icon="camera_filters" slot="media" />
					</ListItem>
					<ListItem link title="Save to Camera Roll" after="Default">
						<ListColorIcon color="#FFC601" icon="square_arrow_down_fill" slot="media" />
					</ListItem>
				</List>

				<List strong outline dividers>
					<ListItem link title="Disappearing Messages" after="Off">
						<ListColorIcon color="#007BFD" icon="timer" slot="media" />
					</ListItem>
					<ListItem
						link
						title="Encription"
						footer="Messages and calls are end-to-end encrypted. Tap to verify."
					>
						<ListColorIcon color="#007BFD" icon="lock_fill" slot="media" />
					</ListItem>
				</List>

				<List strong outline dividers>
					<ListItem link title="Contact Details">
						<ListColorIcon color="#8E8E92" icon="person_circle" slot="media" />
					</ListItem>
				</List>

				<List strong outline dividers>
					<ListButton>Share Contact</ListButton>
					<ListButton>Export Chat</ListButton>
					<ListButton color="red">Clear Chat</ListButton>
				</List>
				<List strong outline dividers>
					<ListButton color="red">Block Contact</ListButton>
					<ListButton color="red">Report Contact</ListButton>
				</List> */}

				{/* <List strong outline dividers>
					<ListButton>Share Contact</ListButton>
					<ListButton>Export Chat</ListButton>
					<ListButton color="red">Clear Chat</ListButton>
				</List> */}
				<List strong outline dividers>
					<ListButton onClick={addBlackList}>{$t('添加到黑名单')}</ListButton>
					<ListButton color="red" onClick={deleteFriend}>
						{$t('删除好友')}
					</ListButton>
				</List>
			</div>
		</Page>
	)
}
