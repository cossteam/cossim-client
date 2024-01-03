import React, { useState, useEffect, useRef } from 'react'
import $ from 'dom7'
import { f7, f7ready, Views, View, Toolbar, Link } from 'framework7-react'
import cordovaApp from '@/config/cordova-app'
import { useUserStore } from '@/stores/user'

const AppComponent = () => {
	const [activeTab, setActiveTab] = useState('chats')
	const previousTab = useRef('chats')
	const { isLogin } = useUserStore()

	useEffect(() => {
		!isLogin && $(`#view-${activeTab}`)[0].f7View.router.navigate(`/auth/`)
	}, [isLogin])

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

	f7ready(() => {
		// Init cordova APIs (see cordova-app.js)
		if (f7.device.cordova) {
			cordovaApp.init(f7)
		}
		// Call F7 APIs here
	})

	return (
		<Views tabs className="safe-areas">
			{isLogin && (
				<>
					<Toolbar tabbar icons bottom>
						<Link
							tabLink="#view-chats"
							tabLinkActive
							iconF7="chat_bubble_2"
							text="聊天"
							onClick={() => onTabLinkClick('chats')}
						/>
						<Link
							tabLink="#view-contacts"
							iconF7="phone"
							text="联系人"
							onClick={() => onTabLinkClick('contacts')}
						/>
						<Link
							tabLink="#view-my"
							iconIos="f7:gear"
							iconMd="material:settings"
							text="我的"
							onClick={() => onTabLinkClick('my')}
						/>
					</Toolbar>
				</>
			)}

			<View id="view-chats" onTabShow={() => setActiveTab('chats')} tab tabActive url="/chats/" main />
			<View id="view-contacts" onTabShow={() => setActiveTab('contacts')} tab url="/contacts/" />
			<View id="view-my" onTabShow={() => setActiveTab('my')} name="my" tab url="/my/" />

			<View id="view-auth" name="auth" tab url="/auth/" />
		</Views>
	)
}
export default AppComponent
