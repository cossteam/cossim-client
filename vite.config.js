import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { createHtmlPlugin } from 'vite-plugin-html'

process.env.TARGET = process.env.TARGET || 'web'
const isCordova = process.env.TARGET === 'cordova'
const SRC_DIR = path.resolve(__dirname, './src')
const PUBLIC_DIR = path.resolve(__dirname, './public')
const BUILD_DIR = path.resolve(__dirname, isCordova ? './cordova/www' : './www')

/*** @type {import('vite').UserConfig} */
export default async () => {
	return defineConfig({
		plugins: [
			react(),
			createHtmlPlugin({
				minify: false,
				inject: {
					data: {
						TARGET: process.env.TARGET
					}
				}
			})
		],
		root: SRC_DIR,
		base: '',
		publicDir: PUBLIC_DIR,
		build: {
			target: "ES2022",
			outDir: BUILD_DIR,
			assetsInlineLimit: 0,
			emptyOutDir: true,
			rollupOptions: {
				treeshake: false
			},
			output: {
				inlineDynamicImports: true
			}
			
		},
		resolve: {
			alias: {
				'@': SRC_DIR
			}
		},
		server: {
			host: true
		}
	})
}
