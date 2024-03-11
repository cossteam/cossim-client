import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import './styles/base.scss'
import 'animate.css'

const root = createRoot(document.getElementById('root')!)
root.render(React.createElement(App))