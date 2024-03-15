import { create } from 'zustand'

interface PreviewItem {
	url: string
	type: 'video' | 'image'
}

export type PreviewStore = {
	list: PreviewItem[]
	opened: boolean
	preview: (...urls: PreviewItem[]) => void
	close: () => void
}

export const usePreviewStore = create<PreviewStore>((set) => ({
	list: [],
	opened: false,
	preview: (...urls) => {
		set({
			list: urls,
			opened: true
		})
	},
	close: () => {
		set({
			list: [],
			opened: false
		})
	}
}))
