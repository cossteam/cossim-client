import { create } from 'zustand'

interface ThemeStore {
	theme: 'light' | 'dark'
	themeOptions: { [key: string]: string }
}

const useThemeStore = create<ThemeStore>()((set) => ({
	theme: 'light',
	themeOptions: {
		primary: '#42b883',
	}
}))

export default useThemeStore
