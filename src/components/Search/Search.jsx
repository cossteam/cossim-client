import React, { useState } from 'react'
import {
	Navbar,
	NavLeft,
	NavTitle,
	Link,
	Page,
	Block,
	Popup,
	Subnavbar,
	Searchbar,
	List,
	ListItem,
	ListGroup
} from 'framework7-react'
import PropTypes from 'prop-types'
import { ChevronLeft } from 'framework7-icons/react'
import { clsx } from 'clsx'
import { $t } from '@/i18n'
import DoubleTickIcon from '@/components/DoubleTickIcon'

// import { debounce } from 'lodash-es'
import './Search.less'

Search.propTypes = {
	title: PropTypes.string,
	className: PropTypes.string,
	placeholder: PropTypes.string
}

export default function Search(props) {
	// const [keywords, setKeywords] = useState('')

	// 用户列表
	const [list, setList] = useState([])

	const handleInput = (e) => {
		// setKeywords(e.target.value)
		console.log(e.target.value)
		// TODO: 请求搜索接口
	}

	// 获取用户列表
	const getUserList = async (keywords) => {}

	// 搜索
	const handleKeyPress = (e) => {
		console.log(e);
		if (e.keyCode === 13) {
			// TODO: 跳转到用户详情页
			console.log('11')
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
						onInput={handleInput}
						onKeyDown={(e) => handleKeyPress(e)}
					/>
				</Subnavbar>

				<Block className="my-5">
					<List>
						{list.map((contact) => (
							<ListItem
								key={contact.nick_name}
								// link={`/profile/${contact.user_id}/`}
								link
								title={contact.nick_name}
								footer={contact.status}
								popupClose
								// onClick={() => handleUserSelect(contact)}
							>
								<img slot="media" src={contact.avatar} alt="" />
							</ListItem>
						))}
					</List>
				</Block>
			</Page>
		</Popup>
	)
}
