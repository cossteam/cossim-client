import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import '@/i18n'
import '@/styles/base.scss'
import App from './app'
import { SafeArea } from '@capacitor-community/safe-area'
import 'reflect-metadata'

const Router = __IS_ELECTRON__ ? HashRouter : BrowserRouter

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Router>
            <App />
        </Router>
    </StrictMode>
)

/**
 * SafeArea Plugin
 * @see: https://github.com/capacitor-community/safe-area?tab=readme-ov-file#using-the-api
 */
if (__IS_NATIVE__) {
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
