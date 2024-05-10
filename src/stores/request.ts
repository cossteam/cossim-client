import { create } from 'zustand'

interface RequestStore {
	currentBaseUrl: string
	currentWsUrl: string
	historyUrls: Array<{ baseUrl: string; wsUrl: string }>
	update: (options: Partial<RequestStore>) => void
}

const BASE_URL = '/'
const devBaseUrl: string = import.meta.env.VITE_DEV_BASE_URL ?? BASE_URL
const devWsUrl: string = import.meta.env.VITE_DEV_WS_URL ?? BASE_URL
const proBaseUrl: string = import.meta.env.VITE_PRO_BASE_URL ?? BASE_URL
const proWsUrl: string = import.meta.env.VITE_PRO_WS_URL ?? BASE_URL

export const defaultRequestStore = {
	currentBaseUrl: import.meta.env.MODE === 'production' ? proBaseUrl : devBaseUrl,
	currentWsUrl: import.meta.env.MODE === 'production' ? proWsUrl : devWsUrl
}

// 创建 store
const useRequestStore = create<RequestStore>((set) => ({
	...defaultRequestStore,
	currentWsUrl: '',
	historyUrls: [],
	update: (options) => set(options)
}))

export default useRequestStore
