import { create } from 'zustand'

// 创建 store
export const useToolbarStore = create<{
	doubleClick: boolean
	longClick: boolean
	onDoubleClick: () => any
}>((set, get) => ({
	doubleClick: false,
	longClick: false,
	onDoubleClick: () => set({ doubleClick: !get().doubleClick })
}))

export default useToolbarStore
