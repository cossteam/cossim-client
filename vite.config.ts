import { defineConfig, UserConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import pages from 'vite-plugin-pages'
import { Capacitor } from '@capacitor/core'

const ELECTRON_ENTRY = path.resolve(__dirname, 'electron/main/index.ts')
const PRELOAD_INPUT = path.resolve(__dirname, 'electron/preload/index.ts')

export default (): UserConfig => {
	const target = process.env.TARGET
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
			__IS_ELECTRON__: JSON.stringify(target === 'electron'),
			__IS_WEB__: Capacitor.getPlatform() === 'web',
			__IS_ANDROID__: Capacitor.getPlatform() === 'android',
			__IS_IOS__: Capacitor.getPlatform() === 'ios',
			__IS_NATIVE__: JSON.stringify(Capacitor.isNativePlatform())
		}
	})
}
