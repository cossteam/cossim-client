import { createElement } from 'react'
import { createRoot } from 'react-dom/client'

import { RouterProvider } from 'react-router-dom'

import { ConfigProvider } from 'antd'

import router from '@/router'
import useThemeStore from '@/stores/theme'

import 'animate.css'
import './styles/base.scss'

const themeStore = useThemeStore.getState()
themeStore.init()

const RouterView = createElement(RouterProvider, { router })
const root = createRoot(document.getElementById('root')!)
root.render(createElement(ConfigProvider, { children: RouterView, theme: { token: themeStore.themeOptions } }))

console.log('🚀 ~ file: main.tsx: 当前主题', themeStore.theme)

// const unsubscribe = useThemeStore.subscribe((state) => {
// 	themeOptions = state.themeOptions
// 	console.log('State updated:', themeOptions)
// })
// 更新状态
// useStore.setState({ count: currentState.count + 1 })
// 取消监听
// unsubscribe()
