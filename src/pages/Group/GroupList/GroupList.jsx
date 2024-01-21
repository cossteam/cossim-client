import React from 'react'
import './GroupList.less'
import { List, ListGroup, ListItem, NavTitle, Navbar, Page } from 'framework7-react'
import { $t } from '@/i18n'
import { useState, useEffect } from 'react'
import { groupListApi } from '@/api/group'

export default function Group() {
	const [groups, setGroups] = useState({})
	useEffect(() => {
		groupListApi().then(({ code, data }) => {
			code === 200 && setGroups(data)
		})
	}, [])

	return (
		<Page className="group-page" noToolbar messagesContent>
			<Navbar className="messages-navbar" backLink>
				<NavTitle>
					<div className="mr-16">{$t('群组')}</div>
				</NavTitle>
			</Navbar>
			<List contactsList noChevron dividers>
				{Object.keys(groups).map((groupKey) => (
					<ListGroup key={groupKey}>
						<ListItem groupTitle title={groupKey} />
						{groups[groupKey].map((group) => (
							<ListItem
								key={group.group_id}
								link={`/groups/${group.group_id}/?dialog_id=${group.dialog_id}/`}
								title={group.name}
								popupClose
							>
								<img slot="media" src={group.avatar} alt="" />
							</ListItem>
						))}
					</ListGroup>
				))}
			</List>
		</Page>
	)
}
