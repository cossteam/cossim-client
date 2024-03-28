import { Link, Toolbar, View, Views } from 'framework7-react'
import { useRef, useState } from 'react'
import $ from 'dom7'
import useCacheStore from '@/stores/cache'
import useRouterStore from '@/stores/router.ts'
import { useDoubleClick } from '@reactuses/core'

const Layout: React.FC = () => {
	const [tabActive, setTabActive] = useState<string>('dialog')
	const previousTab = useRef<string>('dialog')
	const { router } = useRouterStore()
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

	// 全局状态（未读消息）
	const cacheStore = useCacheStore()

	const element = useRef<HTMLButtonElement>(null)
	const dialog = useRef<HTMLButtonElement>(null)
	useDoubleClick({
		target: element,
		onSingleClick: () => {
			console.log('单击')
			contactRef.current.el.click()
		},
		onDoubleClick: () => {
			router.navigate('/add_friend/')
			console.log('双击')
		}
	})
	useDoubleClick({
		target: dialog,
		onSingleClick: () => {
			console.log('单击')
			dialogRef.current.el.click()
		},
		onDoubleClick: () => {
			router.navigate('/add_friend/')
			console.log('双击')
		}
	})

	const contactRef = useRef<any>()
	const dialogRef = useRef<any>()

	return (
		<Views tabs className="safe-area app">
			<View id="view-dialog" onTabShow={() => setTabActive('dialog')} tabActive tab url="/dialog/" main />
			<View id="view-contacts" onTabShow={() => setTabActive('contacts')} tab url="/contacts/" />
			<View id="view-my" onTabShow={() => setTabActive('my')} tab url="/my/" />

			<Toolbar tabbar icons bottom>
				<button ref={dialog}>
					<Link
						ref={dialogRef}
						tabLink="#view-dialog"
						iconF7="chat_bubble_2"
						text="聊天"
						badge={cacheStore.unreadCount}
						badgeColor="red"
						tabLinkActive
						onClick={() => onTabLinkClick('dialog')}
					/>
				</button>

				<button ref={element}>
					<Link
						ref={contactRef}
						tabLink="#view-contacts"
						iconF7="phone"
						text="联系人"
						badge={cacheStore.applyCount}
						badgeColor="red"
						onClick={() => onTabLinkClick('contacts')}
					/>
				</button>
				<Link tabLink="#view-my" iconF7="person" text="我的" onClick={() => onTabLinkClick('my')} />
			</Toolbar>
		</Views>
	)
}

export default Layout
