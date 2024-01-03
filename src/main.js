import React from 'react'
import { createRoot } from 'react-dom/client'

import Framework7React from 'framework7-react'
import Framework7 from 'framework7/lite/bundle'

import './styles/framework7-custom.less'
import './styles/icons.css'
import './styles/app.less'

import Home from './Home'

Framework7.use(Framework7React)
createRoot(document.getElementById('root')).render(React.createElement(Home))
