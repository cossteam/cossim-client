import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import path from 'node:path'
import config from './vite.config'

const ELECTRON_ENTRY = path.resolve(__dirname, 'electron/main/main.ts')
const PRELOAD_INPUT = path.resolve(__dirname, 'electron/preload/preload.ts')

export default defineConfig({
    ...config,
    plugins: [
        ...(config?.plugins || []),
        electron({
            main: {
                entry: ELECTRON_ENTRY
            },
            preload: {
                input: PRELOAD_INPUT
            },
            renderer: process.env.NODE_ENV === 'test' ? undefined : {}
        })
    ],
    define: {
        ...config.define,
        __IS_ELECTRON__: true,
        __IS_WEB__: false
    }
})
