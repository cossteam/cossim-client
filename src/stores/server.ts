import { createPersistStore } from '@/lib/store'

const DEV_BASE_URL = import.meta.env.VITE_DEV_BASE_URL
const DEV_WS_URL = import.meta.env.VITE_DEV_WS_URL
const PRO_BASE_URL = import.meta.env.VITE_PRO_BASE_URL
const PRO_WS_URL = import.meta.env.VITE_PRO_WS_URL

interface ServerState {
    id: string
    baseUrl: string
    wsUrl: string
    remark: string
}

const initialState: ServerState = {
    id: '1',
    baseUrl: import.meta.env.MODE === 'production' ? PRO_BASE_URL : DEV_BASE_URL,
    wsUrl: import.meta.env.MODE === 'production' ? PRO_WS_URL : DEV_WS_URL,
    remark: import.meta.env.MODE === 'production' ? '生产环境' : '测试环境'
}

export const useServerStore = createPersistStore(initialState, () => ({}), {
    name: 'coss-server',
    version: 1
})
