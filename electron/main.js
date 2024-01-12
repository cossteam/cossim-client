// import { app, BrowserWindow } from 'electron'
// import path from 'node:path'

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Signal = require('libsignal')

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win = null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

/**
 * 创建一个新的 BrowserWindow 实例。
 */
function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	})

	// 测试向渲染器进程主动推送消息。
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', new Date().toLocaleString())
	})

	// 加载应用
	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL)
	} else {
		win.loadFile(path.join(process.env.DIST, 'index.html'))
	}

	// 开发模式下打开调试工具。
	if (process.env.NODE_ENV === 'development') {
		win.webContents.openDevTools()
	}
}

// 当所有窗口关闭时退出（macOS 除外）。在那里，很常见
// 让应用程序及其菜单栏保持活动状态直到用户退出
// 明确使用 Cmd + Q。
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
		win = null
	}
})

app.on('activate', () => {
	// 在 OS X 上，当出现以下情况时，通常会在应用程序中重新创建一个窗口：
	// 单击停靠图标，并且没有打开其他窗口。
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

app.whenReady().then(() => {
	// console.log('lib', libsignal)

	ipcMain.on('messageToMain', (event, arg) => {
		// 在这里执行你的逻辑
		console.log('arg', arg) // 输出来自渲染进程的消息

		// 1. 生成身份密钥对
		const identityKeyPair = Signal.keyhelper.generateIdentityKeyPair()
		console.log('密钥对', identityKeyPair)
		console.log('生成注册ID', Signal.keyhelper.generateRegistrationId())
		console.log('生成签名预密钥', Signal.keyhelper.generateSignedPreKey(identityKeyPair))
		console.log('生成预密钥', Signal.keyhelper.generatePreKey())

		// 2. 生成临时对话密钥对
		// const sessionKeyPair = Signal.KeyHelper.generateSessionKeyPair()
		// console.log('生成临时对话密钥对', sessionKeyPair)

		// 发送回复消息给渲染进程
		event.reply('messageFromMain', '这是来自主进程的回复消息')
	})

	createWindow()
})
