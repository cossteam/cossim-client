import React, { useRef, useEffect, useState } from 'react'
import { List, ListItem, Navbar, Link, Page, ListButton } from 'framework7-react'
import './Profile.less'
import ListColorIcon from '@/components/ListColorIcon'
import { contacts } from '@/data'
import { $t } from '@/i18n'
import { getUserInfoApi } from '@/api/user'
import PropTypes from 'prop-types'

AddDetails.propTypes = {
	f7route: PropTypes.object
}

export default function AddDetails(props) {
	const { f7route } = props

	const [info, setInfo] = useState({})

	// const userId = parseInt(f7route.params.id, 10)
	// const contact = contacts.filter(({ id }) => id === userId)[0]

	// console.log('contact', contact)

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
			console.log('res', res)
			if (res.code !== 200) return
			setInfo(res.data?.user_info)
		}
		getUserInfo()
	}, [])

	return (
		<Page ref={pageRef} className="profile-page" noToolbar>
			<Navbar title={$t('用户信息')} backLink="Back" backLinkShowText="" />
			<div className="profile-avatar-block" ref={profileAvatarRef}>
				<img src={info?.avatar} alt="" />
			</div>
			<div className="profile-content">
				<List strong outline dividers mediaList className="no-margin-top">
					<ListItem title={info?.name} text="+1 222 333-44-55">
						<div slot="after" className="profile-actions-links">
							<Link iconF7="chat_bubble_fill" />
							<Link iconF7="camera_fill" />
							<Link iconF7="phone_fill" />
						</div>
					</ListItem>
					<ListItem subtitle={info?.status} text="27 Jun 2021" />
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
					<ListButton>Share Contact</ListButton>
					<ListButton>Export Chat</ListButton>
					<ListButton color="red">Clear Chat</ListButton>
				</List>
			</div>
		</Page>
	)
}
