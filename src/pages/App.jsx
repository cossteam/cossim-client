import React, { useState, useEffect, useRef } from 'react'
import $ from 'dom7'
import { f7, Views, View, Toolbar, Link } from 'framework7-react'

export default function AppComponent() {
	const [activeTab, setActiveTab] = useState('chats')
	const previousTab = useRef('chats')

	useEffect(() => {
		// 修复手机上的视口比例
		if ((f7.device.ios || f7.device.android) && f7.device.standalone) {
			const viewEl = document.querySelector('meta[name="viewport"]')
			viewEl.setAttribute('content', `${viewEl.getAttribute('content')}, maximum-scale=1, user-scalable=no`)
		}
	}, [])

	// 按钮切换
	function onTabLinkClick(tab) {
		if (previousTab.current !== activeTab) {
			previousTab.current = activeTab
			return
		}
		if (activeTab === tab) {
			$(`#view-${tab}`)[0].f7View.router.back()
		}
		previousTab.current = tab
	}

	return (
		<Views tabs className="safe-areas">
			<>
				<Toolbar tabbar icons bottom>
					<Link
						tabLink="#view-chats"
						iconF7="chat_bubble_2"
						text="聊天"
						tabLinkActive
						onClick={() => onTabLinkClick('chats')}
					/>
					<Link
						tabLink="#view-contacts"
						iconF7="phone"
						text="联系人"
						onClick={() => onTabLinkClick('contacts')}
					/>
					<Link tabLink="#view-my" iconF7="person" text="我的" onClick={() => onTabLinkClick('my')} />

					{/* <Link tabLink="#view-chattest" iconF7="person" text="我的" onClick={() => onTabLinkClick('chattest')} /> */}
				</Toolbar>
			</>

			<View id="view-chats" onTabShow={() => setActiveTab('chats')} tabActive tab url="/chats/" main />
			<View id="view-contacts" onTabShow={() => setActiveTab('contacts')} tab url="/contacts/" />
			<View id="view-my" onTabShow={() => setActiveTab('my')} name="my" tab url="/my/" />

			{/* <View id="view-chattest" onTabShow={() => setActiveTab('chattest')} name="chattest" tab url="/chat_test/" /> */}
		</Views>
	)
}
