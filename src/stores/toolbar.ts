import { create } from 'zustand'

// 创建 store
export const useToolbarStore = create<{
	singleClick: boolean,
	doubleClick: boolean,
	longClick: boolean,
	setSingleClick: (value: boolean) => any,
	setDoubleClick: (value: boolean) => any,
	setLongClick: (value: boolean) => any,
}>((set) => ({
	singleClick: false,
	doubleClick: false,
	longClick: false,
	setSingleClick: (value: boolean) => set({ singleClick: value }),
	setDoubleClick: (value: boolean) => set({ doubleClick: value }),
	setLongClick: (value: boolean) => set({ longClick: value }),
}))

export default useToolbarStore