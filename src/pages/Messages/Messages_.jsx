import React, { useState } from 'react'
import { Navbar, Page, List, ListItem, Messages, Message, Subnavbar, Searchbar, Block, theme } from 'framework7-react'
import PropTypes from 'prop-types'

MessagesPage.propTypes = {
	f7route: PropTypes.object.isRequired
}

export default function MessagesPage() {
	const items = []
	for (let i = 1; i <= 530; i += 1) {
		items.push({
			title: `Item ${i}`,
			subtitle: `Subtitle ${i}`
		})
	}
	const [vlData, setVlData] = useState({
		items: []
	})

	const renderExternal = (vl, newData) => {
		console.log(newData.items)
		setVlData({ ...newData })
	}

	return (
		<Page className="messages-page" noToolbar>
			<List
				medialList
				virtualList
				virtualListParams={{
					items,
					renderExternal,
					height: theme.ios ? 63 : theme.md ? 73 : 77
				}}
			>
				<ul>
					{vlData.items.map((item, index) => (
						<ListItem
							key={index}
							mediaItem
							link="#"
							title={item.title}
							subtitle={item.subtitle}
							style={{ top: `${vlData.topPosition}px` }}
							virtualListIndex={items.indexOf(item)}
						/>
					))}
				</ul>
			</List>
		</Page>
	)
}
