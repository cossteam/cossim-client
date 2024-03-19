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
// 注册 service worker
// import './worker'
dayjs.locale('zh-cn')

// Init F7 React Plugin
Framework7.use(Framework7React)

const root = createRoot(document.getElementById('root')!)
root.render(React.createElement(App))


