import { Link, List, ListButton, ListItem, Navbar, Page, Toggle } from 'framework7-react'
import { useRef, useState } from 'react'
import { useAsyncEffect } from '@reactuses/core'
import { isEqual } from 'lodash-es'

import { $t } from '@/shared'
import UserStore from '@/db/user'
import UserService from '@/api/user'
import './Profile.scss'
import { useCallStore } from '@/stores/call'
// import { useCallStore } from '@/stores/call'

const Profile: React.FC<RouterProps> = ({ f7route, f7router }) => {
	const user_id = f7route.params.user_id as string

	const pageRef = useRef<{ el: HTMLDivElement | null }>({ el: null })
	const profileAvatarRef = useRef<HTMLDivElement | null>(null)

	const [userInfo, setUserInfo] = useState<any>({})

	// 页面安装时将页面滚动到头像大小的一半
	const onPageInit = () => {
		const profileAvatarHeight = profileAvatarRef.current!.offsetHeight
		pageRef.current.el!.querySelector('.page-content')!.scrollTop = profileAvatarHeight / 2
	}

	useAsyncEffect(
		async () => {
			const user = await UserStore.findOneById(UserStore.tables.friends, 'user_id', user_id)

			const { data } = await UserService.getUserInfoApi({ user_id })

			const updateData = { ...user, ...data }

			setUserInfo(updateData)

			// 比较两个对象是否相同
			if (isEqual(user, updateData)) return
			await UserStore.update(UserStore.tables.friends, 'user_id', user_id, updateData)
		},
		() => {},
		[]
	)

	// 呼叫
	const { call } = useCallStore()
	const callUser = async () => {
		call({ userInfo }, () => {
			f7router.navigate('/call/')
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
							<Link
								iconF7="chat_bubble_fill"
								// href={`/chats/${f7route.params.id}/?dialog_id=${userInfo?.dialog_id}`}
							/>
							<Link iconF7="camera_fill" />
							<Link iconF7="phone_fill" onClick={callUser} />
						</div>
					</ListItem>
					<ListItem subtitle={userInfo?.signature} text={userInfo?.email} />
				</List>

				<List strong outline dividers className="bg-white m-0 mb-3">
					<ListItem title={$t('阅后即焚')}>
						<Toggle slot="after" />
					</ListItem>
					<ListItem title={$t('消息免打扰')}>
						<Toggle slot="after" />
					</ListItem>
					<ListItem title={$t('添加到黑名单')}>
						<Toggle slot="after" />
					</ListItem>
				</List>

				<List strong outline dividers className="bg-white m-0 mb-3">
					<ListButton color="red">{$t('清除聊天记录')}</ListButton>
					{userInfo?.preferences ? (
						<ListButton color="red" title={$t('删除好友')}></ListButton>
					) : (
						<ListButton>{$t('添加好友')}</ListButton>
					)}
				</List>
			</div>
		</Page>
	)
}

export default Profile
