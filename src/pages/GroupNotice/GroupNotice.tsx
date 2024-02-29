import GroupService from '@/api/group'
import { $t } from '@/shared'
import { useAsyncEffect } from '@reactuses/core'
import { Plus } from 'framework7-icons/react'
import { Card, CardContent, Link, NavRight, Navbar, Page } from 'framework7-react'
import { useMemo, useState } from 'react'
import { format } from 'timeago.js'

const GroupNotice: React.FC<RouterProps> = ({ f7route }) => {
	const group_id = f7route.params.group_id
	const isGroupLeader = useMemo(() => {
		console.log(f7route, f7route?.params?.identity)

		return f7route?.query?.identity ? parseInt(f7route?.query?.identity) === 2 : false
	}, [f7route?.query?.identity])

	const [groupAnnouncement, setGroupAnnouncement] = useState<any>(null)

	const loadNotification = async () => {
		const groupAnnouncement = await GroupService.groupAnnouncementApi({ group_id })
		setGroupAnnouncement(groupAnnouncement.data)
		return groupAnnouncement?.data || []
	}

	useAsyncEffect(
		async () => {
			loadNotification()
		},
		() => {},
		[]
	)

	return (
		<Page noToolbar className="bg-bgTertiary" onPageBeforeIn={loadNotification}>
			<Navbar title={$t('群公告')} backLink className="bg-bgPrimary">
				<NavRight>
					{isGroupLeader && (
						<Link href={`/create_group_notice/${group_id}/`} className="text-2xl">
							<Plus />
						</Link>
					)}
				</NavRight>
			</Navbar>
			{groupAnnouncement ? (
				groupAnnouncement.map((item: any, index: number) => {
					return (
						// <div key={index}>
						// 	<input name="title" type="text" value={item.title} className="bg-white" />
						// 	<textarea name="content" value={item.content} />
						// </div>
						<Card className="coss_card_title m-3" key={index}>
							<CardContent className="flex justify-center flex-col">
								<div className="text-textPrimary text-sm font-bold">{item.title}</div>
								<div className="my-2 text-textSecondary text-sm line-clamp-2 break-all">
									{item.content}
								</div>
								<span className="text-xs text-gray-400">
									{format(item?.updated_at ? item?.updated_at : item?.created_at, 'zh_CN')}
								</span>
							</CardContent>
						</Card>
					)
				})
			) : (
				<p className="text-center pt-5 text-textSecondary">{$t('暂无公告')}</p>
			)}
		</Page>
	)
}

export default GroupNotice
