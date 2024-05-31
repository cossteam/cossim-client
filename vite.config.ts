import { defineConfig, UserConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import pages from 'vite-plugin-pages'
import { Capacitor } from '@capacitor/core'

const ELECTRON_ENTRY = path.resolve(__dirname, 'electron/main/main.ts')
const PRELOAD_INPUT = path.resolve(__dirname, 'electron/preload/preload.ts')

export default (): UserConfig => {
	const target = process.env.TARGET
	const __IS_ELECTRON__ = JSON.stringify(target === 'electron')
	const __IS_WEB__ = Capacitor.getPlatform() === 'web'
	const __IS_ANDROID__ = Capacitor.getPlatform() === 'android'
	const __IS_IOS__ = Capacitor.getPlatform() === 'ios'
	const __IS_NATIVE__ = JSON.stringify(Capacitor.isNativePlatform())

	return defineConfig({
		plugins: [
			react(),
			target === 'electron' &&
				electron({
					main: {
						entry: ELECTRON_ENTRY
					},
					preload: {
						input: PRELOAD_INPUT
					},
					renderer: process.env.NODE_ENV === 'test' ? undefined : {}
				}),
			pages()
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
				'~': fileURLToPath(new URL('./electron', import.meta.url))
			}
		},
		define: {
			__IS_ELECTRON__,
			__IS_WEB__,
			__IS_ANDROID__,
			__IS_IOS__,
			__IS_NATIVE__
		}
	})
}
