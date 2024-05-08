import React from 'react'
import { createRoot } from 'react-dom/client'

import Framework7 from 'framework7/lite-bundle'
import Framework7React from 'framework7-react'
import 'framework7/css/bundle'
import 'framework7-icons'

import App from './App'
import './styles/base.scss'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

import 'animate.css'

import { getCookie, setCookie } from './utils/cookie'
import { BASE_URL, WS_URL } from './shared'

const baseUrl = getCookie(BASE_URL)
const wsUrl = getCookie(WS_URL)
if (!baseUrl) {
	setCookie(
		BASE_URL,
		import.meta.env.MODE === 'production' ? import.meta.env.VITE_PRO_BASE_URL : import.meta.env.VITE_DEV_BASE_URL
	)
}
if (!wsUrl) {
	setCookie(
		WS_URL,
		import.meta.env.MODE === 'production' ? import.meta.env.VITE_PRO_WS_URL : import.meta.env.VITE_DEV_WS_URL
	)
}

dayjs.locale('zh-cn')

// Init F7 React Plugin
Framework7.use(Framework7React)

const root = createRoot(document.getElementById('root')!)
root.render(React.createElement(App))
