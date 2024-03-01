import GroupService from '@/api/group'
import { $t } from '@/shared'
import { useAsyncEffect } from '@reactuses/core'
import { Plus } from 'framework7-icons/react'
import { Card, CardContent, Icon, Link, NavRight, Navbar, Page, f7 } from 'framework7-react'
import { useMemo, useState } from 'react'
import { format } from 'timeago.js'

const GroupNotice: React.FC<RouterProps> = ({ f7route, f7router }) => {
	const group_id = f7route.params.group_id
	const isGroupLeader = useMemo(() => {
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

	// 删除群公告
	const deleteGroupAnnouncement = async (id: number) => {
		f7.dialog.confirm($t('是否确认删除群公告?'), $t('删除'), async () => {
			try {
				const { code, msg } = await GroupService.deleteGroupAnnouncementApi({
					group_id: parseInt(group_id!),
					id
				})
				if (code !== 200) {
					f7.dialog.alert($t(msg || '删除群公告失败'))
					return
				}
				if (code === 200) {
					loadNotification()
				}
			} catch (error: any) {
				return f7.dialog.alert($t(error?.message || '删除群公告失败'))
			} finally {
				f7.dialog.close()
			}
		})
	}

	return (
		<Page noToolbar className="bg-bgTertiary" onPageBeforeIn={loadNotification}>
			<Navbar title={$t('群公告')} backLink className="bg-bgPrimary">
				<NavRight>
					{isGroupLeader && (
						<Link href={`/create_group_notice/${group_id}/?admin=${isGroupLeader}`} className="text-2xl">
							<Plus />
						</Link>
					)}
				</NavRight>
			</Navbar>
			{groupAnnouncement ? (
				groupAnnouncement.map((item: any, index: number) => {
					return (
						<Card className="coss_card_title m-3" key={index}>
							<CardContent className="flex justify-center flex-col">
								<div
									onClick={() =>
										f7router.navigate(
											`/create_group_notice/${group_id}/?id=${item.id}&admin=${isGroupLeader}`
										)
									}
								>
									<div className="flex justify-between items-center">
										<div className="text-textPrimary text-base font-bold line-clamp-1 break-all">
											{item.title}
										</div>
										{isGroupLeader && (
											<div
												onClick={(e) => {
													e.stopPropagation()
													deleteGroupAnnouncement(item.id)
												}}
											>
												<Icon className="m-2" f7="xmark_circle" size={18} />
											</div>
										)}
									</div>
									<div className="my-2 text-textSecondary text-sm line-clamp-2 break-all">
										{item.content}
									</div>
									<div className="text-xs text-gray-400 flex justify-between items-center">
										<span className="">
											{format(item?.updated_at ? item?.updated_at : item?.created_at, 'zh_CN')}
										</span>
										<span>{item.read_user_list ? item.read_user_list.length : 0}人已读</span>
									</div>
								</div>
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
