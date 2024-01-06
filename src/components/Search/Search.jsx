import React, { useState } from 'react'
import { Navbar, NavLeft, NavTitle, Link, Page, Block, Popup, Subnavbar, Searchbar, f7 } from 'framework7-react'
import PropTypes from 'prop-types'
import { ChevronLeft, Search as SearchIcon } from 'framework7-icons/react'
import { clsx } from 'clsx'
import { $t } from '@/i18n'
import { getUserInfoApi } from '@/api/user'

import './Search.less'

Search.propTypes = {
	title: PropTypes.string,
	className: PropTypes.string,
	placeholder: PropTypes.string
}

export default function Search(props) {
	const [keywords, setKeywords] = useState('')

	const tips = $t('搜索')

	const search = async () => {
		try {
			const res = await getUserInfoApi({ email: keywords, type: 0 })
			console.log('res', res)
			if (res.code !== 200) {
				// f7.dialog.alert(res.msg)
				f7.dialog.alert(res.msg)
			}
		} catch (error) {
			f7.dialog.alert(error.message)
		}
	}

	return (
		<Popup className={clsx('search-popup', props.className)}>
			<Page>
				<Navbar>
					<NavLeft>
						<Link popupClose>
							<ChevronLeft className="w-5 h-5" />
						</Link>
					</NavLeft>
					<NavTitle>{props.title}</NavTitle>
				</Navbar>

				<Subnavbar>
					<Searchbar
						placeholder={props.placeholder}
						disableButtonText={$t('取消')}
						onInput={(e) => setKeywords(e.target.value)}
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
		</Popup>
	)
}
