import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import pages from 'vite-plugin-pages'

const target = process.env.TARGET

const ELECTRON_ENTRY = path.resolve(__dirname, 'electron/main.ts')
const PRELOAD_INPUT = path.resolve(__dirname, 'electron/preload.ts')

export default defineConfig({
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
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	server: {}
})
