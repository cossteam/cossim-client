import React from 'react'
import { createRoot } from 'react-dom/client'

import { RouterProvider } from 'react-router-dom'
import router from './router'

import 'animate.css'
import './styles/base.scss'

const root = createRoot(document.getElementById('root')!)
root.render(React.createElement(RouterProvider, { router }))
