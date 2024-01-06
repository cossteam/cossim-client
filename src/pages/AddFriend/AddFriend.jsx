import React, { useState } from 'react'
import { Navbar, Page, Block, Subnavbar, Searchbar, f7 } from 'framework7-react'
import { Search as SearchIcon } from 'framework7-icons/react'
import { $t } from '@/i18n'
import { getUserInfoApi } from '@/api/user'
import useLoading from '@/shared/useLoading'
import PropTypes from 'prop-types'

AddFriend.propTypes = {
	f7router: PropTypes.object
}

export default function AddFriend(props) {
	const { f7router } = props
	const { show, hide } = useLoading()

	// useEffect(() => {
	// 	console.log('f7router', f7router)
	// 	console.log('$(f7router.selector)[0]', $(f7router.selector))
	// }, [])

	const [keywords, setKeywords] = useState('123132@qq.com')

	const tips = $t('搜索')

	const search = async () => {
		try {
			show()
			const res = await getUserInfoApi({ email: keywords, type: 0 })
			if (res.code !== 200) return f7.dialog.alert(res.msg)
			// 跳转页面
			const path = `/profile/${res.data.user_info.user_id}`
			console.log('path', path)
			f7router.navigate(`/profile/${res.data.user_info.user_id}/`)
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

			<Subnavbar>
				<Searchbar
					placeholder={$t('邮箱')}
					disableButtonText={$t('取消')}
					onInput={(e) => setKeywords(e.target.value)}
					onCancel={() => setKeywords('')}
				/>
			</Subnavbar>

			<Block className="my-5">
				{keywords && (
					<div className="flex items-center text-[1rem]" onClick={search}>
						<SearchIcon className="w-5 h-5 text-icon-cc" />
						<span className="ml-2">{tips}：</span>
						<span className="text-primary">{keywords}</span>
					</div>
				)}
			</Block>
		</Page>
	)
}
