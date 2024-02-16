import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
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
	}
	// server: {
	// 	proxy: {
	// 		'/api/v1': {
	// 			target: ENV.VITE_BASE_URL,
	// 			changeOrigin: true,
	// 			rewrite: (path) => path.replace(/^\/api\/v1/, '')
	// 		},
	// 		'/api/v1/msg/ws': {
	// 			target: ENV.VITE_WS_URL,
	// 			changeOrigin: true,
	// 			rewrite: (path) => path.replace(/^\/api\/v1\/msg\/ws/, '')
	// 		}
	// 	}
	// }
})
