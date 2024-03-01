import { $t } from '@/shared'
import { Button, Card, CardContent, NavRight, Navbar, Page, f7 } from 'framework7-react'
import { useMemo, useState } from 'react'
import GroupService from '@/api/group'
import { useAsyncEffect } from '@reactuses/core'
import { mapValues, pick } from 'lodash-es'

interface Notification {
	id?: number
	group_id: number
	title: string
	content: string
	create_at?: number
	update_at?: number
	operator_info?: {
		user_id: string
		avatar: string
		name: string
	}
}

const CreateGroupNotice: React.FC<RouterProps> = ({ f7route, f7router }) => {
	// 群ID
	const group_id = useMemo(() => {
		return f7route?.params?.group_id
	}, [f7route?.params?.group_id])
	// 是否管理员
	const is_admin = useMemo(() => {
		console.log(f7route?.query)
		return f7route?.query?.admin === 'true'
	}, [f7route?.query?.dmin])
	// 公告ID
	const id = useMemo(() => {
		return f7route?.query?.id
	}, [f7route?.query?.id])
	// 是否创建模式
	const is_created = useMemo(() => {
		return id === undefined
	}, [id])

	// 公告
	const [notification, setNotification] = useState<Notification>({
		group_id: group_id ? parseInt(group_id) : -1,
		title: '',
		content: ''
	})
	// 公告详情
	const [notificationDetail, setNotificationDetail] = useState<Notification>({
		group_id: group_id ? parseInt(group_id) : -1,
		title: '',
		content: ''
	})

	// 获取公告详情
	useAsyncEffect(
		async () => {
			if (is_created) return
			const { code, data } = await GroupService.getGroupAnnouncementApi({
				group_id,
				id
			})
			if (code === 200) {
				setNotificationDetail(data)
				setNotification(
					mapValues(notification, (_, key) => {
						const value = data[key]
						if (['group_id', 'id'].includes(key) && typeof value === 'string') {
							return parseInt(value)
						}
						return value
					})
				)
				await GroupService.readGroupAnnouncementApi({
					group_id: parseInt(group_id!),
					id: parseInt(id!)
				})
			}
		},
		() => {},
		[is_created, group_id, id]
	)

	// 创建群公告
	const createNotification = async () => {
		try {
			f7.dialog.preloader($t('创建中...'))
			const { code, msg } = await GroupService.createGroupAnnouncementApi(notification)
			if (code !== 200) {
				f7.dialog.alert($t(msg))
				return
			}
			if (code === 200) {
				f7router.back()
				setNotification({ ...notification, title: '', content: '' })
			}
		} catch (error: any) {
			f7.dialog.alert($t(error?.message || '群公告创建失败...'))
		} finally {
			f7.dialog.close()
		}
	}

	// 编辑
	const editNotification = async () => {
		try {
			f7.dialog.preloader($t('编辑中...'))
			const reqData = {
				...notificationDetail,
				...notification
			}
			pick(reqData, ['group_id', 'id', 'title', 'content'])
			const { code, msg } = await GroupService.updateGroupAnnouncementApi(reqData)
			if (code !== 200) {
				f7.dialog.alert($t(msg))
				return
			}
			if (code === 200) {
				f7router.back()
				setNotification({ ...notification, title: '', content: '' })
				setNotificationDetail({ ...notificationDetail, title: '', content: '' })
			}
		} catch (error: any) {
			f7.dialog.alert($t(error?.message || '群公告编辑失败...'))
		} finally {
			f7.dialog.close()
		}
	}

	return (
		<Page noToolbar className="bg-bgTertiary">
			<Navbar
				title={is_created ? $t('创建群公告') : $t(is_admin ? '编辑群公告' : '群公告详情')}
				backLink
				className="bg-bgPrimary"
			>
				<NavRight>
					{is_admin && (
						<Button
							large
							disabled={!notification.title || !notification.content}
							onClick={is_created ? createNotification : editNotification}
						>
							{$t('完成')}
						</Button>
					)}
				</NavRight>
			</Navbar>

			<Card className="coss_card_title">
				<CardContent className="flex justify-center flex-col items-center">
					{is_admin ? (
						<input
							className="bg-transparent w-full text-base"
							name="title"
							placeholder={$t('请输入标题')}
							value={notification?.title}
							onChange={(e) => setNotification({ ...notification, title: e.target.value })}
						/>
					) : (
						<div className="w-full break-all text-base">{notification?.title}</div>
					)}
				</CardContent>
			</Card>

			<Card className="coss_card_content">
				<CardContent className="flex justify-center flex-col items-center">
					{is_admin ? (
						<textarea
							className="bg-transparent w-full"
							name="content"
							placeholder={$t('请填写内容')}
							rows={5}
							value={notification?.content}
							onChange={(e) => setNotification({ ...notification, content: e.target.value })}
						/>
					) : (
						<div className="text-gray-600 w-full break-all">{notification?.content}</div>
					)}
				</CardContent>
			</Card>
		</Page>
	)
}

export default CreateGroupNotice
