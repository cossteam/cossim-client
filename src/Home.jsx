import React from 'react'
// import i18next from 'i18next'
import './i18n'
import f7params from '@/config'
import cordovaApp from '@/config/cordova-app'

import AppComponent from './pages/App'
import { f7, App, f7ready, Views } from 'framework7-react'

// import { useSettingStore } from '@/stores/setting'
// import { useEffect } from 'react'

/**
 * 这里主要做一些全局配置之类的事情
 * @returns
 */
const Home = () => {
	// TODO: 读取本地国际化，切换语言
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
