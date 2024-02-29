import GroupService from '@/api/group'
import { $t } from '@/shared'
import { useAsyncEffect } from '@reactuses/core'
import { Plus } from 'framework7-icons/react'
import { Link, NavRight, Navbar, Page } from 'framework7-react'
import { useState } from 'react'

const GroupNotice: React.FC<RouterProps> = ({ f7route }) => {
	const group_id = f7route.params.group_id

	const [groupAnnouncement, setGroupAnnouncement] = useState<any>(null)

	useAsyncEffect(
		async () => {
			const groupAnnouncement = await GroupService.groupAnnouncementApi({ group_id })
			setGroupAnnouncement(groupAnnouncement.data)
		},
		() => {},
		[]
	)

	return (
		<Page noToolbar className="bg-bgTertiary">
			<Navbar title={$t('群公告')} backLink className="bg-bgPrimary">
				<NavRight>
					<Link href={`/create_group_notice/${group_id}/`} className="text-2xl">
						<Plus />
					</Link>
				</NavRight>
			</Navbar>

			{groupAnnouncement ? (
				<>
					<input type="text" />
					<textarea name="" id=""></textarea>
				</>
			) : (
				<p className="text-center pt-5 text-textSecondary">{$t('暂无公告')}</p>
			)}
		</Page>
	)
}

export default GroupNotice
