import { CommonOptions, CommonStoreMethods, StoreSetMethods } from '@/types/store'

export const storeActions = (set: StoreSetMethods, get: () => CommonOptions): CommonStoreMethods => ({
	init: async () => {
		const options = get()
		console.log('🚀 ~ 当前主题', options.theme)
	}
})
