import React from 'react'
import { getDevice } from 'framework7/lite-bundle'
// import './i18n'
// import '@/config'
// import f7params from '@/config'
import cordovaApp from '@/config/cordova-app'

import AppComponent from './pages/App'
import { f7, App, f7ready, Views, View } from 'framework7-react'

import routes from '@/config/routes'
import { useUserStore } from '@/stores/user'

/**
 * 这里主要做一些全局配置之类的事情
 * @returns
 */
const Home = () => {
	// TODO: 配置提取到一个文件中
	const device = getDevice()
	// Framework7 Parameters
	const f7params = {
		name: '', // App name
		theme: 'auto', // Automatic theme detection

		// App store
		store: [],
		// App routes
		routes: routes,

		// Input settings
		input: {
			scrollIntoViewOnFocus: device.cordova,
			scrollIntoViewCentered: device.cordova
		},
		// Cordova Statusbar settings
		statusbar: {
			iosOverlaysWebView: true,
			androidOverlaysWebView: false
		},

		colors: {
			primary: '#33a854'
		}
	}

	// TODO: 国际化
	// i18next.changeLanguage('zh-CN')

	f7ready(() => {
		// 注册 cordova API
		if (f7.device.cordova) {
			cordovaApp.init(f7)
		}
	})

	const { isLogin } = useUserStore()

	return (
		<App {...f7params}>
			<Views tabs className="safe-area">
				{isLogin ? <AppComponent isLogin={isLogin} /> : <View id="view-auth" name="auth" url="/auth/" />}
			</Views>
		</App>
	)
}

export default Home
