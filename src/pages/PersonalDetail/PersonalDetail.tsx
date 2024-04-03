import { List, ListButton, ListItem, Navbar, Page, f7 } from 'framework7-react'
import { useRef, useState } from 'react'
import { useAsyncEffect } from '@reactuses/core'

import { $t, toastMessage } from '@/shared'
import UserService from '@/api/user'
import './PersonalDetail.scss'
import Remark from '@/components/Remark/Remark'
import RelationService from '@/api/relation'
import useLoading from '@/hooks/useLoading.ts'
import useCacheStore from '@/stores/cache'

const PersonalDetail: React.FC<RouterProps> = ({ f7route, f7router }) => {
	const user_id = f7route.params.user_id as string

	const pageRef = useRef<{ el: HTMLDivElement | null }>({ el: null })
	const profileAvatarRef = useRef<HTMLDivElement | null>(null)

	const [userInfo, setUserInfo] = useState<any>({})

	const { watchAsyncFn } = useLoading()

	const cacheStore = useCacheStore()

	// 页面安装时将页面滚动到头像大小的一半
	const onPageInit = () => {
		const profileAvatarHeight = profileAvatarRef.current!.offsetHeight
		pageRef.current.el!.querySelector('.page-content')!.scrollTop = profileAvatarHeight / 2
	}

	useAsyncEffect(
		async () => {
			try {
				const { data, code } = await watchAsyncFn(() => UserService.getUserInfoApi({ user_id }))
				if (code == 200) {
					setUserInfo(data)
					// 已经存在好友关系
					if (data.preferences) {
						f7router.navigate(`/profile/${user_id}/`, { reloadCurrent: true })
					}
				}
			} catch (error) {
				console.error('获取用户信息失败', error)
			}
		},
		() => {},
		[]
	)

	const [opened, setOpened] = useState<boolean>(false)
	const addFriend = async (remark: string) => {
		try {
			f7.dialog.preloader($t('添加中...'))
			console.log('cacheStore.cacheKeyPair?.publicKey ', cacheStore)

			const { code } = await RelationService.addFriendApi({
				user_id,
				remark,
				e2e_public_key: cacheStore.cacheKeyPair?.publicKey ?? ''
			})

			if (code !== 200) {
				toastMessage('添加失败')
				return
			}

			toastMessage('添加成功,等待对方同意')
		} catch (error) {
			console.error(error)
		} finally {
			f7.dialog.close()
		}
	}

	return (
		<Page ref={pageRef} className="profile-page bg-bgTertiary" noToolbar onPageInit={onPageInit}>
			<Navbar title={$t('用户信息')} backLink className="bg-bgPrimary hidden-navbar-bg" />
			<div className="profile-avatar-block" ref={profileAvatarRef}>
				<img src={userInfo?.avatar} alt="" />
			</div>
			<div className="profile-content">
				<List strong outline dividers mediaList className="no-margin-top m-0 mb-3 bg-white">
					<ListItem title={userInfo?.nickname}></ListItem>
					<ListItem subtitle={userInfo?.signature} text={userInfo?.email} />
				</List>

				<List strong outline dividers className="bg-white m-0 mb-3">
					<ListButton onClick={() => setOpened(true)}>{$t('添加好友')}</ListButton>
				</List>
			</div>

			<Remark opened={opened} onPopupClosed={setOpened} send={addFriend} />
		</Page>
	)
}

export default PersonalDetail
