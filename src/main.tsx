import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { languageInit } from '@/i18n'
import '@/styles/base.scss'
import App from './app'
import { showToast, showNotification } from '@/utils/prompt'

/**
 * mounted window
 */
const mountedWindow = async () => {
    window.storage = undefined
    window.showToast = showToast
    window.showNotification = showNotification
}

/**
 * create DOM element
 */
const createDOMElement = async () => {
    const Router = __IS_ELECTRON__ ? HashRouter : BrowserRouter
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <Router>
                <App />
            </Router>
        </StrictMode>
    )
}

/**
 * SafeArea Plugin
 * @see: https://github.com/capacitor-community/safe-area?tab=readme-ov-file#using-the-api
 */
const safeAreaInitialization = async () => {
    if (__IS_NATIVE__) {
        const { SafeArea } = await import('@capacitor-community/safe-area')
        SafeArea.enable({
            config: {
                customColorsForSystemBars: true,
                statusBarColor: '#00000000'
                // statusBarContent: 'light',
                // navigationBarColor: '#00000000',
                // navigationBarContent: 'light'
            }
        })
    }
}

languageInit()
mountedWindow()
createDOMElement()
safeAreaInitialization()
