import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

import 'animate.css'
import './styles/base.scss'



const root = createRoot(document.getElementById('root')!)
root.render(React.createElement(App))