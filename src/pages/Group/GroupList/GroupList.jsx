import React from 'react'
import './GroupList.less'
import { List, ListGroup, ListIndex, ListItem, NavTitle, Navbar, Page } from 'framework7-react'
import { $t } from '@/i18n'
import { useState, useEffect } from 'react'

export default function Group() {
	const [groups, setGroups] = useState({})
	useEffect(() => {
		setGroups({})
	}, [])

	return (
		<Page className="group-page" noToolbar messagesContent>
			<Navbar className="messages-navbar" backLink>
				<NavTitle>
					<div className="mr-16">{$t('群组')}</div>
				</NavTitle>
			</Navbar>
			<ListIndex indexes={Object.keys(groups)} listEl=".contacts-list" />
			<List contactsList noChevron dividers>
				{Object.keys(groups).map((groupKey) => (
					<ListGroup key={groupKey}>
						<ListItem groupTitle title={groupKey} />
					</ListGroup>
				))}
			</List>
		</Page>
	)
}
