// Import React and ReactDOM
import React from 'react'
import { createRoot } from 'react-dom/client'
// Import Framework7
import Framework7 from 'framework7/lite-bundle'
// Import Framework7-React Plugin
import Framework7React from 'framework7-react'
// Import Framework7 Styles
import 'framework7/css/bundle'
// Import Icons and App Custom Styles
// import
// import 'framework7-icons/css/framework7-icons.css'
// import './styles/icons.css'
// import './styles/framework7-custom.less'
import 'framework7-icons'
import './styles/app.less'
// Import App Component
import Home from './Home.jsx'

import * as serviceWorker from './utils//serviceWorker'

// Init F7 React Plugin
Framework7.use(Framework7React)

// Mount React App
const root = createRoot(document.getElementById('app'))
root.render(React.createElement(Home))

// 如果您希望您的应用程序能够离线工作并更快加载，您可以更改
// 下面的 unregister() 到 register() 。请注意，这会带来一些陷阱。
// 了解有关服务人员的更多信息：https://bit.ly/CRA-PWA
serviceWorker.unregister()

// 删除预加载脚本加载
// postMessage({ payload: 'removeLoading' }, '*')

// 使用上下文桥
window.ipcRenderer?.on('main-process-message', (_event, message) => {
	console.log('main=>', message)
	window.ipcRenderer.send('messageToMain', '')
})

// 接收来自主进程的回复消息
window.ipcRenderer?.on('messageFromMain', (event, result) => {
	console.log('主进程回复的消息', result)
})
