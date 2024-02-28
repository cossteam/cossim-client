import { Link, Toolbar, View, Views } from 'framework7-react'
import { useRef, useState } from 'react'
import $ from 'dom7'

const Layout: React.FC = () => {
	const [tabActive, setTabActive] = useState<string>('dialog')
	const previousTab = useRef<string>('dialog')

	const onTabLinkClick = (tabName: string) => {
		if (previousTab.current !== tabActive) {
			previousTab.current = tabActive
			return
		}
		if (tabActive === tabName) {
			// @ts-ignore
			$(`#view-${tabName}`)[0].f7View.router.back()
		}
		previousTab.current = tabName
	}

	return (
		<Views tabs className="safe-area app">
			<View id="view-dialog" onTabShow={() => setTabActive('dialog')} tabActive tab url="/dialog/" main />
			<View id="view-contacts" onTabShow={() => setTabActive('contacts')} tab url="/contacts/" />
			<View id="view-my" onTabShow={() => setTabActive('my')} name="my" tab url="/my/" />

			<Toolbar tabbar icons bottom>
				<Link
					tabLink="#view-dialog"
					iconF7="chat_bubble_2"
					text="聊天"
					tabLinkActive
					onClick={() => onTabLinkClick('dialog')}
				/>
				<Link
					tabLink="#view-contacts"
					iconF7="phone"
					text="联系人"
					onClick={() => onTabLinkClick('contacts')}
				/>
				<Link tabLink="#view-my" iconF7="person" text="我的" onClick={() => onTabLinkClick('my')} />
			</Toolbar>
		</Views>
	)
}

export default Layout
