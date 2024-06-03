import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import pages from 'vite-plugin-pages'
import { Capacitor } from '@capacitor/core'
// import { visualizer } from 'rollup-plugin-visualizer'

const __IS_WEB__ = Capacitor.getPlatform() === 'web'
const __IS_ANDROID__ = Capacitor.getPlatform() === 'android'
const __IS_IOS__ = Capacitor.getPlatform() === 'ios'
const __IS_NATIVE__ = JSON.stringify(Capacitor.isNativePlatform())

export default defineConfig({
    plugins: [
        react(),
        pages()
        // visualizer({ open: false })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '~': path.resolve(__dirname, './electron')
        }
    },
    define: {
        __IS_ELECTRON__: false,
        __IS_WEB__,
        __IS_ANDROID__,
        __IS_IOS__,
        __IS_NATIVE__,
        'process.env': {}
    },
    build: {
        minify: 'terser',
        cssCodeSplit: true,
        terserOptions: {
            compress: {
                drop_console: false,
                drop_debugger: true
            }
        },
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                // manualChunks(id) {
                //     if (id.includes('node_modules')) {
                //         return id.toString().split('node_modules/')[1].split('/')[0].toString()
                //     }
                // }
                chunkFileNames: 'js/[name]-[hash].js',
                entryFileNames: 'js/[name]-[hash].js',
                assetFileNames: '[ext]/[name]-[hash].[ext]'
            }
        }
    }
})
