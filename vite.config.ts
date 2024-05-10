import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pluginBasicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), pluginBasicSsl()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "@/styles/variables.scss";`,
				javascriptEnabled: true
			}
		}
	},
	build: {
		// minify: 'terser',
		// terserOptions: {
		// 	compress: {
		// 		drop_console: true,
		// 		drop_debugger: true
		// 	}
		// }
		//  拆分超过 1M 的文件代码
		chunkSizeWarningLimit: 1000,
		//  生成 map 文件
		sourcemap: true
		//  压缩混淆代码
	}
	// server: {
	// proxy: {
	// 	'/api/v1': {
	// 		target: ENV.VITE_BASE_URL,
	// 		changeOrigin: true,
	// 		rewrite: (path) => path.replace(/^\/api\/v1/, '')
	// 	},
	// 	'/api/v1/msg/ws': {
	// 		target: ENV.VITE_WS_URL,
	// 		changeOrigin: true,
	// 		rewrite: (path) => path.replace(/^\/api\/v1\/msg\/ws/, '')
	// 	}
	// }
	// }
})
