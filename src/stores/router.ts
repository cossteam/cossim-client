import { create } from 'zustand'
import { Router } from 'framework7/types';

// 创建 store
export const useRouterStore = create<any>((set: any) => ({
	router: null,
	setRouter: (newRouter: Router.Router) => set({ router: newRouter }),
}))

export default useRouterStore