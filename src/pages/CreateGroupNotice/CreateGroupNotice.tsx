import { $t } from '@/shared'
import { Button, Card, CardContent, NavRight, Navbar, Page, f7 } from 'framework7-react'
import { useState } from 'react'
import GroupService from '@/api/group'

interface Notification {
	group_id: number
	title: string
	content: string
}

const CreateGroupNotice: React.FC<RouterProps> = ({ f7route, f7router }) => {
	const is_created = f7route.query.isCreated ?? true

	// 通知
	const [notification, setNotification] = useState<Notification>({
		group_id: f7route?.params?.group_id ? parseInt(f7route.params.group_id) : -1,
		title: '',
		content: ''
	})

	// 创建群通知
	const createNotification = async () => {
		try {
			f7.dialog.preloader($t('创建中...'))
			const { code, msg } = await GroupService.createGroupAnnouncementApi(notification)
			if (code === 200) {
				f7router.back()
				setNotification({ ...notification, title: '', content: '' })
			}
			if (code !== 200) {
				f7.dialog.alert($t(msg))
				return
			}
		} catch (error: any) {
			f7.dialog.alert($t(error?.message || '群公告创建失败...'))
		} finally {
			f7.dialog.close()
		}
	}

	return (
		<Page noToolbar className="bg-bgTertiary">
			<Navbar title={is_created ? $t('创建群公告') : $t('编辑群公告')} backLink className="bg-bgPrimary">
				<NavRight>
					<Button large disabled={!notification.title || !notification.content} onClick={createNotification}>
						{$t('完成')}
					</Button>
				</NavRight>
			</Navbar>

			<Card className="coss_card_title">
				<CardContent className="flex justify-center flex-col items-center">
					<input
						className="bg-transparent w-full"
						placeholder={$t('请输入名称')}
						name="title"
						value={notification?.title}
						onChange={(e) => setNotification({ ...notification, title: e.target.value })}
					/>
				</CardContent>
			</Card>

			<Card className="coss_card_content">
				<CardContent className="flex justify-center flex-col items-center">
					<textarea
						className="bg-transparent w-full"
						name="content"
						rows={5}
						placeholder={$t('请填写公告...')}
						value={notification?.content}
						onChange={(e) => setNotification({ ...notification, content: e.target.value })}
					/>
				</CardContent>
			</Card>
		</Page>
	)
}

export default CreateGroupNotice
