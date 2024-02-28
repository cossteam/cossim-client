import GroupService from '@/api/group'
import { $t, USER_ID } from '@/shared'
import { getCookie } from '@/utils/cookie'
import { List, ListGroup, ListItem, NavTitle, Navbar, Page } from 'framework7-react'
import { useEffect, useState } from 'react'

const GroupListList: React.FC<RouterProps> = () => {
	const user_id = getCookie(USER_ID) || ''
	const [groups, setGroups] = useState({})
	useEffect(() => {
		GroupService.groupListApi().then(({ code, data }) => {
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
						{
							// @ts-ignore
							groups[groupKey].map((group: any) => (
								<ListItem
									key={group.group_id}
									link={`/message/${group?.group_id}/${group?.dialog_id}/?is_group=${group?.user_id ? 'false' : 'true'}&dialog_name=${group?.name}`}
									title={group.name}
									popupClose
								>
									<img
										slot="media"
										className="size-10  object-cover rounded-full"
										src={group.avatar}
										alt=""
									/>
								</ListItem>
							))
						}
					</ListGroup>
				))}
			</List>
		</Page>
	)
}

export default GroupListList
