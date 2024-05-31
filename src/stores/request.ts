import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

interface BaseConfig {
  id: string
  baseUrl: string
  wsUrl: string
  remark: string
}

interface RequestStore {
  config: BaseConfig
  historyUrls: Array<{ id: string; baseUrl: string; wsUrl: string; remark: string }>
  update: (options: Partial<RequestStore>) => void
  pushHistory: (baseUrl: string, wsUrl: string, remark: string) => void
  deleteHistory: (id: string) => void
}

const BASE_URL = '/'
const devBaseUrl: string = import.meta.env.VITE_DEV_BASE_URL ?? BASE_URL
const devWsUrl: string = import.meta.env.VITE_DEV_WS_URL ?? BASE_URL
const proBaseUrl: string = import.meta.env.VITE_PRO_BASE_URL ?? BASE_URL
const proWsUrl: string = import.meta.env.VITE_PRO_WS_URL ?? BASE_URL

export const defaultRequestStore = {
  id: '1',
  baseUrl: import.meta.env.MODE === 'production' ? proBaseUrl : devBaseUrl,
  wsUrl: import.meta.env.MODE === 'production' ? proWsUrl : devWsUrl,
  remark: import.meta.env.MODE === 'production' ? '生产环境' : '测试环境'
}

const requestStore = (set: any): RequestStore => ({
  config: defaultRequestStore,
  historyUrls: [
    { id: '1', baseUrl: devBaseUrl, wsUrl: devWsUrl, remark: '测试环境' },
    { id: '2', baseUrl: proBaseUrl, wsUrl: proWsUrl, remark: '生产环境' }
  ],
  update: (options) => set(options),
  pushHistory: (baseUrl, wsUrl, remark) => {
    set((state: RequestStore) => {
      const historyUrls = state.historyUrls.filter(
        (item) => item.baseUrl !== baseUrl && item.wsUrl !== wsUrl
      )
      historyUrls.unshift({ id: Date.now().toString(), baseUrl, wsUrl, remark })
      return { historyUrls }
    })
  },
  deleteHistory: (id) => {
    set((state: RequestStore) => {
      const historyUrls = state.historyUrls.filter((item) => item.id !== id)
      return { historyUrls }
    })
  }
})

const useRequestStore = create(
  devtools(
    persist(requestStore, {
      name: 'COSS_REQUEST_STORE',
      storage: createJSONStorage(() => localStorage)
    })
  )
)

export default useRequestStore
