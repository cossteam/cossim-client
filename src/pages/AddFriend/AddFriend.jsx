import React, { useState, useEffect } from 'react'
import { Navbar, Page, Searchbar, f7, List, ListItem } from 'framework7-react'
import { $t } from '@/i18n'
import { searchUserApi, getUserInfoApi } from '@/api/user'
import useLoading from '@/shared/useLoading'
import PropTypes from 'prop-types'

AddFriend.propTypes = {
	f7router: PropTypes.object
}

export default function AddFriend(props) {
	const { f7router } = props
	const { show, hide } = useLoading()

	const [keywords, setKeywords] = useState('')
	const [userList, setUserList] = useState([])
	const searchUser = async () => {
		const { data } = await searchUserApi({
			email: keywords
		})
		setUserList(data ? [data] : [])
	}
	useEffect(() => {
		if (keywords === '') return
		searchUser()
	}, [keywords])

	const getUserInfo = async (user_id) => {
		try {
			show()
			const res = await getUserInfoApi({ user_id })
			if (res.code !== 200) return f7.dialog.alert(res.msg)
			// 跳转页面
			f7router.navigate(`/add_details/${res.data.user_id}/`)
		} catch (error) {
			// 这里可以上报异常
			f7.dialog.alert(error.message)
		} finally {
			hide()
		}
	}

	return (
		<Page noToolbar>
			<Navbar backLink="Back" backLinkShowText="" title={$t('添加朋友')}>
				{/* <NavLeft>
					<Link popupClose>
						<ChevronLeft className="w-5 h-5" />
					</Link>
				</NavLeft> */}
				{/* <NavTitle>{$t('添加朋友')}</NavTitle> */}
			</Navbar>
			<Searchbar
				searchContainer=".contacts-list"
				placeholder={$t('请输入完整邮箱')}
				disableButtonText={$t('取消')}
				onInput={(e) => setKeywords(e.target.value)}
				onCancel={() => setKeywords('')}
			/>
			{keywords && (
				<div className="flex items-center text-[1rem]">
					<List contactsList noChevron dividers>
						{userList.map((user, index) => (
							<ListItem
								key={index}
								title={user?.nickname || ''}
								footer={user?.signature || ''}
								popupClose
								onClick={() => getUserInfo(user?.user_id)}
							>
								<img slot="media" src={user?.avatar} alt="" />
							</ListItem>
						))}
					</List>
				</div>
			)}
		</Page>
	)
}
