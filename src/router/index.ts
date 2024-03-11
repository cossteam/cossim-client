import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import Login from '@/pages/Account/Login/Login'
import Dashboard from '@/pages/Dashboard/Dashboard'

const routes = [
	{
		path: '/',
		element: React.createElement(Dashboard)
	},
	{
		path: '/login',
		element: React.createElement(Login)
	}
]

export default createBrowserRouter(routes)
