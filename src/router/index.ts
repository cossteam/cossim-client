import { createElement, Suspense, lazy, LazyExoticComponent } from 'react'
import { createBrowserRouter, RouteObject, Navigate } from 'react-router-dom'

import Loading from '@/components/Loading'
import NotFound from '@/pages/NotFound'
// import Dashboard from '@/pages/Dashboard/Dashboard'
// import Login from '@/pages/Account/Login/Login'
import App from '@/App'

const Dashboard = lazy(() => import('@/pages/Dashboard/Dashboard'))
const Login = lazy(() => import('@/pages/Account/Login/Login'))

/**
 * 懒加载 + loading
 *
 * @param component	懒加载组件
 * @returns
 */
const lazyLoad = (component: LazyExoticComponent<() => JSX.Element> | LazyExoticComponent<() => string>) => {
	return createElement(Suspense, {
		fallback: createElement(Loading),
		children: createElement(component)
	})
}

const routes: RouteObject[] = [
	{
		path: '/',
		element: createElement(App),
		children: [
			{
				path: '',
				element: createElement(Navigate, { to: '/dashboard', replace: true })
			},
			{
				path: 'dashboard',
				element: lazyLoad(Dashboard)
			}
		]
	},
	{
		path: '/login',
		element: lazyLoad(Login)
	},
	{
		path: '*',
		element: createElement(NotFound)
	}
]

export default createBrowserRouter(routes)
