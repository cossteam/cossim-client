import React, { useState } from 'react'
import { Navbar, NavLeft, NavTitle, Link, Page, Block, Popup, Subnavbar, Searchbar, f7 } from 'framework7-react'
import { ChevronLeft } from 'framework7-icons/react'
import PropTypes from 'prop-types'
import { clsx } from 'clsx'
import { $t } from '@/i18n'
import { useEffect } from 'react'

export default function Contact(props) {
	const [keywords, setKeywords] = useState('')
    const [opened, setOpened] = useState(false)

    useEffect(()=>{},[props.opened])

	return (
		<Popup className="contact-popup" opened={opened}>
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
						placeholder={props.placeholder || $t('搜索')}
						disableButtonText={$t('取消')}
						onInput={(e) => setKeywords(e.target.value)}
					/>
				</Subnavbar>

				<Block className="my-5">最近</Block>
			</Page>
		</Popup>
	)
}

Contact.propTypes = {
	title: PropTypes.string,
	placeholder: PropTypes.string,
    opened: PropTypes.bool
}
