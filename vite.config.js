/*eslint no-undef: "off"*/
import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
// import electron from 'vite-plugin-electron/simple'

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
			// electron({
			//   main: {
			//     // Shortcut of `build.lib.entry`.
			//     entry: "electron/main.js",
			//   },
			//   preload: {
			//     // Shortcut of `build.rollupOptions.input`.
			//     // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
			//     input: path.join(__dirname, "electron/preload.js"),
			//   },
			//   // Ployfill the Electron and Node.js built-in modules for Renderer process.
			//   // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
			//   renderer: {},
			// }),
		],
		root: SRC_DIR,
		base: '',
		publicDir: PUBLIC_DIR,
		build: {
			// target: 'ES2022',
			outDir: BUILD_DIR,
			assetsInlineLimit: 0,
			emptyOutDir: true,
			rollupOptions: {
				treeshake: false
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
