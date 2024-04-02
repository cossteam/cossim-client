import { Link, Toolbar, View, Views } from 'framework7-react'
import { useRef, useState } from 'react'
import $ from 'dom7'
import useCacheStore from '@/stores/cache'
import useRouterStore from '@/stores/router.ts'
import useToolbarStore from '@/stores/toolbar.ts'
import useLongPress from '@/hooks/useLongPress.ts'
import MsgService from '@/api/msg.ts'

const Layout: React.FC = () => {
	const [tabActive, setTabActive] = useState<string>('dialog')
	const previousTab = useRef<string>('dialog')
	const { router, contactRouter } = useRouterStore()
	const { setDoubleClick } = useToolbarStore()
	const onTabLinkClick = (tabName: string) => {
		if (previousTab.current !== tabActive) {
			previousTab.current = tabActive
			return
		}
		if (tabActive === tabName) {
			console.log(router)
			console.log('双击')
			switch (tabName) {
				case 'dialog':
					setDoubleClick(true)
					break
				case 'contacts':
					if (cacheStore.applyCount)
					contactRouter?.navigate('/apply_list/')
					break
				case 'my':
					break
			}

			// @ts-ignore
			$(`#view-${tabName}`)[0].f7View.router.back()
		}
		previousTab.current = tabName
	}

	// 全局状态（未读消息）
	const cacheStore = useCacheStore()

	const buttonRef = useRef<HTMLButtonElement | null>(null)

	const promiseList: any = []
	// 长按全部已读
	useLongPress(buttonRef, {
		callback: () => {
			const store = useCacheStore.getState()
			const list = store.cacheDialogs.map((item: any) => {
				// 有未读的对话
				if (item.dialog_unread_count > 0) {
					promiseList.push(MsgService.readMessagesApi({dialog_id: item.dialog_id, msg_ids: [], read_all: true}, item.dialog_type == 1))
				}
				return { ...item, dialog_unread_count: 0 }
			})
			Promise.all(promiseList)
			store.updateCacheDialogs(list)
			store.updateCacheUnreadCount(0)

		}
	})

	const dialogRef = useRef<any>()

	return (
		<Views tabs className="safe-area app">
			<View id="view-dialog" onTabShow={() => setTabActive('dialog')} tabActive tab url="/dialog/" main />
			<View id="view-contacts" onTabShow={() => setTabActive('contacts')} tab url="/contacts/" />
			<View id="view-my" onTabShow={() => setTabActive('my')} tab url="/my/" />

			<Toolbar tabbar icons bottom>
				<button ref={buttonRef}>
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
				<button>
					<Link
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
