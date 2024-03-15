import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import pluginImport from 'vite-plugin-importer'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		// pluginImport({
		// 	libraryName: '@arco-design/mobile-react',
		// 	libraryDirectory: 'esm',
		// 	style: (path) => `${path}/style`
		// }),
		// pluginImport({
		// 	libraryName: '@arco-design/mobile-react/esm/icon',
		// 	libraryDirectory: '',
		// 	camel2DashComponentName: false
		// })
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	css: {
		preprocessorOptions: {
			// scss: {
			// 	additionalData: `@import "@/styles/variables.scss";`,
			// 	javascriptEnabled: true
			// },
			// less: {
			// 	// lessOptions: {
			// 	javascriptEnabled: true
			// 	// modifyVars: {}
			// 	// }
			// }
		}
	}
})
