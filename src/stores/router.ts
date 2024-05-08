import { create } from 'zustand'
import { Router } from 'framework7/types'

interface MyRouter {
	router: null | Router.Router
	contactRouter: null | Router.Router
	myRouter: null | Router.Router
	setRouter: (newRouter: Router.Router) => void
	setContactRouter: (newRouter: Router.Router) => void
	setMyRouter: (newRouter: Router.Router) => void
}

// 创建 store
export const useRouterStore = create<MyRouter>((set) => ({
	router: null,
	contactRouter: null,
	myRouter: null,
	setRouter: (newRouter) => set({ router: newRouter }),
	setContactRouter: (newRouter) => set({ contactRouter: newRouter }),
	setMyRouter: (newRouter) => set({ myRouter: newRouter })
}))

export default useRouterStore
