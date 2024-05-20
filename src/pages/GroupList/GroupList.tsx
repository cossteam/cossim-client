import GroupService from '@/api/group'
import { $t } from '@/shared'
import useMessageStore from '@/stores/message'
import { useAsyncEffect } from '@reactuses/core'
import { List, ListGroup, ListItem, NavTitle, Navbar, Page, f7 } from 'framework7-react'
import { useState } from 'react'

const GroupListList: React.FC<RouterProps> = ({ f7router }) => {
	// 消息列表
	const messageStore = useMessageStore()
	const [groups, setGroups] = useState({})
	useAsyncEffect(
		async () => {
			try {
				f7.dialog.preloader($t('获取中...'))
				const { code, data } = await GroupService.groupListApi()
				code === 200 && setGroups(data.list)
			} catch (error: any) {
				f7.dialog.alert($t(error?.message || '获取群列表失败...'))
			} finally {
				f7.dialog.close()
			}
		},
		() => {},
		[]
	)

	return (
		<Page className="group-page" noToolbar messagesContent>
			<Navbar className="messages-navbar" backLink>
				<NavTitle>
					<div className="">{$t('群组')}</div>
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
									// link={`/message/${group?.group_id}/${group?.dialog_id}/?is_group=${group?.user_id ? 'false' : 'true'}&dialog_name=${group?.name}`}
									title={group.name}
									popupClose
									onClick={async () => {
										await messageStore.init({
											dialogId: group?.dialog_id ?? 0,
											receiverId: group?.user_id ?? group?.group_id ?? 0,
											isGroup: !!group?.group_id,
											receiverInfo: group
											// group?.group_id ? true : false,
											// group?.dialog_id,
											// group?.user_id ?? group?.group_id
										})
										f7router.navigate(
											`/message/${group?.group_id}/${group?.dialog_id}/?is_group=${group?.user_id ? 'false' : 'true'}&dialog_name=${group?.name}`
										)
									}}
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
