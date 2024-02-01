import React, { useState } from 'react'
import {
	Navbar,
	NavLeft,
	NavTitle,
	Link,
	Block,
	Subnavbar,
	Searchbar,
	List,
	LoginScreen,
	ListItem,
	NavRight,
	Button
} from 'framework7-react'
import { ChevronLeft } from 'framework7-icons/react'
import PropTypes from 'prop-types'
// import { clsx } from 'clsx'
import { $t } from '@/i18n'
import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import userService from '@/db'

export default function Contact({ opened, setOpened, ...props }) {
	const [keywords, setKeywords] = useState('')
	const [chats, setChats] = useState([])
	const [select, setSelect] = useState([])
	const chatsList = useLiveQuery(() => userService.findAll(userService.TABLES.CHATS))

	const onChange = (chat) => {
		const index = select.findIndex((v) => v.dialog_id === chat.dialog_id)
		// 取消选择
		if (index !== -1) {
			select.splice(index, 1)
			setSelect([...select])
			return
		}
		setSelect([...select, chat])
	}

	const send = () => {
		setSelect([])
		setOpened(false)
		props.send(select)
	}

	useEffect(() => {
		if (chatsList) setChats(chatsList)
	}, [chatsList])

	return (
		<LoginScreen opened={opened}>
			<Navbar>
				<NavLeft>
					<Link onClick={() => setOpened(false)}>
						<ChevronLeft className="w-5 h-5" />
					</Link>
				</NavLeft>
				<NavTitle>{props.title}</NavTitle>
				<NavRight>
					<Button onClick={send}>{$t('发送')}</Button>
				</NavRight>
			</Navbar>
			<Subnavbar>
				<Searchbar
					placeholder={props.placeholder || $t('搜索')}
					disableButtonText={$t('取消')}
					onInput={(e) => setKeywords(e.target.value)}
				/>
			</Subnavbar>

			<Block className="py-5 h-screen overflow-auto">
				<List contactsList noChevron dividers mediaList className="chats-list">
					{chats.map((chat) => (
						<ListItem
							key={chat.dialog_id}
							title={chat.dialog_name}
							checkbox
							checkboxIcon="end"
							onChange={() => onChange(chat)}
							checked={select.some((v) => v.dialog_id === chat.dialog_id)}
						>
							<img slot="media" src={`${chat.dialog_avatar}`} loading="lazy" alt={chat.dialog_name} />
						</ListItem>
					))}
				</List>
			</Block>
		</LoginScreen>
	)
}

Contact.propTypes = {
	title: PropTypes.string,
	placeholder: PropTypes.string,
	opened: PropTypes.bool,
	setOpened: PropTypes.func,
	send: PropTypes.func
}
