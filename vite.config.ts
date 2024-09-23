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
        pages({
            importMode(filepath) {
                if (filepath.includes('index')) {
                    return 'sync'
                }
                return 'async'
            }
        })

        // visualizer({ open: true })
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
        // minify: 'terser',
        // cssCodeSplit: true,
        // terserOptions: {
        //     compress: {
        //         drop_console: false,
        //         drop_debugger: true
        //     }
        // },
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    openpgp: ['openpgp'],
                    i18next: ['i18next']
                }
                // chunkFileNames: 'js/[name]-[hash].js',
                // entryFileNames: 'js/[name]-[hash].js',
                // assetFileNames: '[ext]/[name]-[hash].[ext]'
            }
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "./src/styles/scss/mixin.scss";`
            }
        }
    }
})
