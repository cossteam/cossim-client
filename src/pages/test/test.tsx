import { $t } from '@/shared'
import { List, NavTitle, Navbar, Page } from 'framework7-react'

const Test: React.FC<RouterProps> = () => {
	return (
		<Page className="group-page" noToolbar messagesContent>
			<Navbar className="messages-navbar" backLink>
				<NavTitle>
					<div className="">{$t('测试')}</div>
				</NavTitle>
			</Navbar>
			<List contactsList noChevron dividers>
				测试页面
				<div
					onTouchEnd={() => alert('结束触摸')}
					onDoubleClick={() => {
						alert('双击')
						console.log('双击')
					}}
				>
					button
				</div>
			</List>
		</Page>
	)
}

export default Test
