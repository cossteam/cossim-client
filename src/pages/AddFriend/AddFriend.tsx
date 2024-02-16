import { List, ListItem, Navbar, Page, Searchbar, Subnavbar, f7 } from 'framework7-react'
import { useState } from 'react'

import { $t } from '@/shared'
import './AddFriend.scss'
import UserService from '@/api/user'
import { validEmail } from '@/utils/validate'
import UserStore from '@/db/user'

const AddFriend: React.FC<RouterProps> = ({ f7router }) => {
	const [keyWord, setKeyword] = useState<string>('')

	const search = async () => {
		if (!validEmail(keyWord)) return f7.dialog.alert($t('请输入正确的邮箱地址'))
		try {
			f7.dialog.preloader($t('搜索中...'))

			// 先查找本地好友列表，查看是否是自己好友
			const user = await UserStore.findOneById(UserStore.tables.friends, 'email', keyWord)
			if (user) {
				f7router.navigate(`/profile/${user.user_id}`)
				return
			}

			const { data } = await UserService.searchUserApi({ email: keyWord })

			if (!data) return f7.dialog.alert($t('搜索用户不存在'))
			f7router.navigate(`/personal_detail/${data.user_id}/`)
		} catch (error) {
			console.error('搜索用户失败', error)
			f7.dialog.alert($t('搜索用户失败'))
		} finally {
			f7.dialog.close()
		}
	}

	return (
		<Page noToolbar className="bg-bgTertiary coss_add">
			<Navbar className="hidden-navbar-bg bg-bgPrimary" backLink title={$t('添加好友')}>
				<Subnavbar inner={false} className="bg-bgPrimary coss_navbar_search">
					<Searchbar
						placeholder={$t('搜索邮箱')}
						disableButtonText={$t('取消')}
						onChange={(e) => setKeyword(e.target.value)}
						onClickClear={() => setKeyword('')}
						onClickDisable={() => setKeyword('')}
					/>
				</Subnavbar>
			</Navbar>

			<List className="m-0 bg-bgPrimary py-2">
				{!!keyWord && (
					<ListItem link onClick={search}>
						<div className="flex items-center max-w-[70%] overflow-hidden text-ellipsis whitespace-nowrap line-clamp-1">
							{$t(`查找：`)}
							<span className="text-primary">{keyWord}</span>
						</div>
					</ListItem>
				)}
			</List>
		</Page>
	)
}

export default AddFriend
