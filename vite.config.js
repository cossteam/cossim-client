/*eslint no-undef: "off"*/
import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
// import electron from 'vite-plugin-electron/simple'
// import { VitePluginNode } from 'vite-plugin-node'
// import { nodePolyfills } from 'vite-plugin-node-polyfills'

// import requireTransform from 'vite-plugin-require-transform'
// import commonjs from '@rollup/plugin-commonjs'

// import Components from 'unplugin-vue-components/vite'
// import { VantResolver } from '@vant/auto-import-resolver'
// import babel from 'vite-plugin-babel'
// import babelConfig from './babel.config'

process.env.TARGET = process.env.TARGET || 'web'
const isCordova = process.env.TARGET === 'cordova'
const SRC_DIR = path.resolve(__dirname, './src')
const PUBLIC_DIR = path.resolve(__dirname, './public')
const BUILD_DIR = path.resolve(__dirname, isCordova ? './cordova/www' : './www')

/*** @type {import('vite').UserConfig} */
export default async ({ mode }) => {
	const http = loadEnv(mode, process.cwd())
	console.log('http', http, mode)
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
			}),
			// babel()
			// Components({
			// 	resolvers: [VantResolver()]
			// })
			// commonjs()
			// requireTransform({
			// 	fileRegex: /.js$|.vue$|.ts$|.tsx$|.jsx$/
			// })
			// electron({
			// 	main: {
			// 		// Shortcut of `build.lib.entry`.
			// 		entry: 'electron/main.js'
			// 	},
			// 	preload: {
			// 		// Shortcut of `build.rollupOptions.input`.
			// 		// Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
			// 		input: path.join(__dirname, 'electron/preload.js')
			// 	},
			// 	// Ployfill the Electron and Node.js built-in modules for Renderer process.
			// 	// See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
			// 	renderer: {}
			// })
			// nodePolyfills({
			// 	include:['fs','path'],
			// 	globals: {
			// 		Buffer: true,
			// 		global: true,
			// 		process: true,
			// 	}
			// }),
			// ...VitePluginNode({
			// 	// Nodejs 原生请求适配器
			// 	// 目前这个插件支持'express'，'nest'，'koa'和'fastify'开箱即用，
			// 	// 如果您使用其他框架，您还可以传递函数，请参阅自定义适配器部分
			// 	adapter: 'express',

			// 	// 告诉插件你的项目入口在哪里
			// 	appPath: './src/main.js',

			// 	// 可选，默认：'viteNodeApp'
			// 	// appPath 文件中您的应用程序的命名导出的名称
			// 	// exportName: 'viteNodeApp',

			// 	// 可选，默认： false
			// 	// 如果您想在启动时初始化您的应用程序，请将其设置为 true
			// 	// initAppOnBoot: false,

			// 	// Optional, default: 'esbuild'
			// 	// The TypeScript compiler you want to use
			// 	// by default this plugin is using vite default ts compiler which is esbuild
			// 	// 'swc' compiler is supported to use as well for frameworks
			// 	// like Nestjs (esbuild dont support 'emitDecoratorMetadata' yet)
			// 	// you need to INSTALL `@swc/core` as dev dependency if you want to use swc
			// 	// tsCompiler: 'esbuild',

			// 	// Optional, default: {
			// 	// jsc: {
			// 	//   target: 'es2019',
			// 	//   parser: {
			// 	//     syntax: 'typescript',
			// 	//     decorators: true
			// 	//   },
			// 	//  transform: {
			// 	//     legacyDecorator: true,
			// 	//     decoratorMetadata: true
			// 	//   }
			// 	// }
			// 	// }
			// 	// swc configs, see [swc doc](https://swc.rs/docs/configuration/swcrc)
			// 	// swcOptions: {}
			// })
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
			},
			// 设置 externals，避免打包时将 Node.js 模块打包进去
			external: ['electron']
		},
		resolve: {
			alias: {
				'@': SRC_DIR
			}
		},
		server: {
			// host: true,
			// proxy: {
			// 	'/api/v1': {
			// 		target: mode === 'development' ? http.VITE_DEV_BASE_URL : http.VITE_PROD_BASE_URL,
			// 		changeOrigin: true,
			// 		rewrite: (path) => path.replace(/^\/api\/v1/, '')
			// 	}
			// }
		},
		define: {
			// 'process': true
			'process.env': {}
		}
	})
}
