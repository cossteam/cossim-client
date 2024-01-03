import React from 'react'
import { getDevice } from 'framework7/lite-bundle'
// import './i18n'
// import '@/config'
// import f7params from '@/config'
import cordovaApp from '@/config/cordova-app'

import AppComponent from './pages/App'
import { f7, App, f7ready, Views } from 'framework7-react'

import routes from '@/config/routes'
// import store from '@/stores'

/**
 * 这里主要做一些全局配置之类的事情
 * @returns
 */
const Mian = () => {
	// TODO: 配置提取到一个文件中
	const device = getDevice()
	// Framework7 Parameters
	const f7params = {
		name: 'IM Demo', // App name
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

	return (
		<App {...f7params}>
			<Views tabs className="safe-area">
				<AppComponent />
			</Views>
		</App>
	)
}

export default Home
