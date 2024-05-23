// import { CommonOptions, CommonStoreMethods, StoreSetMethods } from '@/types/store'
import { THEME } from '@/utils/enum'
import { create } from 'zustand'
// import { devtools, persist } from 'zustand/middleware'

// const states: CommonOptions = {
// 	theme: THEME.LIGHT,
// 	themeColor: '#00b96b'
// }

// const actions = (set: StoreSetMethods, get: () => CommonOptions): CommonStoreMethods => ({
// 	init: async () => {
// 		const options = get()
// 		console.log('🚀 ~ 当前主题', options.theme)
// 	}
// })

const useCommonStore = create()
// devtools(
// 	persist<>(store),
// 		{
// 			name: 'COMMON_STORE',
// 			storage: createJSONStorage(() => localStorage)
// 		}
// 	)
// )

export { useCommonStore }
