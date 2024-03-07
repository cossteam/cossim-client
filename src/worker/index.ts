// import { Workbox } from 'workbox-window'
// import url from './server-work?url'
// import { App as CapApp, AppState } from '@capacitor/app'

// let worker: Workbox

// if ('serviceWorker' in navigator) {
// 	worker = new Workbox(url)
// 	worker.register().then(
// 		() => {
// 			console.log('Service Worker Registered', worker)
// 		},
// 		(err) => {
// 			console.log('Service Worker registration failed: ', err)
// 		}
// 	)

// 	/**
// 	 * 页面激活变化
// 	 *
// 	 * @param {AppState} state 页面激活状态
// 	 */
// 	const appChange = async (state: AppState) => {
// 		console.log('isActive', state, worker)

// 		worker.messageSW({ type: 'AppState', data: { isActive: state.isActive } })
// 	}

// 	CapApp.addListener('appStateChange', appChange)
// }

// export { worker as default }
