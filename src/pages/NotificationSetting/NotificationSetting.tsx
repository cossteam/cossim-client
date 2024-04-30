import { $t } from '@/shared'
import useNotificationStore from '@/stores/notification'
import { List, ListItem, Navbar, Page, Toggle } from 'framework7-react'
import { useMemo } from 'react'

const NotificationSetting: React.FC<RouterProps> = () => {
	const useNotification = useNotificationStore()

	const enableNotification = useMemo(() => {
		return useNotification.enableNotification
	}, [useNotification.enableNotification])

	const showDetail = useMemo(() => {
		return useNotification.showDetail
	}, [useNotification.showDetail])

	const toggle = (key: string, value: any) => {
		useNotification.update({
			[key]: value
		})
	}

	return (
		<Page noToolbar>
			<Navbar backLink title="通知中心" />
			<List strong outline dividers className="bg-white m-0 mb-3">
				<ListItem title={$t('接收新消息通知')}>
					<Toggle
						slot="after"
						checked={enableNotification}
						onChange={() => toggle('enableNotification', !enableNotification)}
					/>
				</ListItem>
				<ListItem title={$t('展示新消息详情')}>
					<Toggle slot="after" checked={showDetail} onChange={() => toggle('showDetail', !showDetail)} />
				</ListItem>
			</List>
		</Page>
	)
}

export default NotificationSetting
