import React, { useRef, useEffect, useState } from 'react'
import { List, ListItem, Navbar, Page, ListButton, f7 } from 'framework7-react'
import { $t } from '@/i18n'
import { getUserInfoApi } from '@/api/user'
import PropTypes from 'prop-types'
import { addFriendApi } from '@/api/relation'
import { useUserStore } from '@/stores/user'
import { dbService } from '@/db'
import { exportPublicKey } from '@/utils/signal/signal-crypto'

AddDetails.propTypes = {
	f7route: PropTypes.object
}

export default function AddDetails(props) {
	const { f7route } = props

	const [info, setInfo] = useState({})

	const { user } = useUserStore()


	const pageRef = useRef(null)
	const profileAvatarRef = useRef(null)

	useEffect(() => {
		// 页面安装时将页面滚动到头像大小的一半
		const profileAvatarHeight = profileAvatarRef.current.offsetHeight
		pageRef.current.el.querySelector('.page-content').scrollTop = profileAvatarHeight / 2
	}, [])

	useEffect(() => {
		const getUserInfo = async () => {
			const res = await getUserInfoApi({ user_id: f7route.params.id, type: 1 })
			if (res.code !== 200) return
			setInfo(res.data)
		}
		getUserInfo()
	}, [])

	const addFriend = async () => {
		try {
			console.log('f7route.params.id', f7route.params.id)
			const users = await dbService.findOneById(dbService.TABLES.USERS, user?.user_id)
			if (!users) return f7.dialog.alert('系统内部错误')

			// console.log("store",users?.data?.signal?.store)
			// const exportedPublicKey = await crypto.subtle.exportKey('spki', users?.data?.keyPair?.publicKey)
			// const exportedKeyBase64 = fromUint8Array(new Uint8Array(exportedPublicKey))

			const directory = {
				...JSON.parse(users?.data?.directory),
				publicKey: await exportPublicKey(users?.data?.keyPair?.publicKey)
			}

			const res = await addFriendApi({
				user_id: f7route.params.id,
				e2e_public_key: JSON.stringify(directory),
				msg: ''
			})
			if (res.code !== 200) return f7.dialog.alert(res.msg)

			f7.dialog.alert('发送成功，等待对方同意')
		} catch (error) {
			console.log('公钥交换失败', error)
		}
	}

	return (
		<Page ref={pageRef} className="profile-page" noToolbar>
			<Navbar title={$t('用户信息')} backLink="Back" backLinkShowText="" />
			<div className="profile-avatar-block" ref={profileAvatarRef}>
				<img src={info?.avatar} alt="" />
			</div>
			<div className="profile-content">
				<List strong outline dividers mediaList className="no-margin-top">
					<ListItem title={info?.nick_name} text={info?.tel}>
						{/* <div slot="after" className="profile-actions-links">
							<Link iconF7="chat_bubble_fill" />
							<Link iconF7="camera_fill" />
							<Link iconF7="phone_fill" />
						</div> */}
					</ListItem>
					<ListItem subtitle={info?.status} />
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

				<List strong outline dividers>
					<ListButton onClick={addFriend}>{$t('添加好友')}</ListButton>
					{/* <ListButton>Export Chat</ListButton> */}
					{/* <ListButton color="red">Clear Chat</ListButton> */}
				</List>
			</div>
		</Page>
	)
}
