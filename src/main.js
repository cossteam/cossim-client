// Import React and ReactDOM
import React from 'react'
import { createRoot } from 'react-dom/client'
import '@/db'

// Import Framework7
import Framework7 from 'framework7/lite-bundle'

// Import Framework7-React Plugin
import Framework7React from 'framework7-react'

// Import Framework7 Styles
import 'framework7/css/bundle'

// Import Icons and App Custom Styles
// import
// import 'framework7-icons/css/framework7-icons.css'
// import './styles/icons.css'
// import './styles/framework7-custom.less'
import 'framework7-icons'
import './styles/app.less'

// Import App Component
import Home from './Home.jsx'

// Init F7 React Plugin
Framework7.use(Framework7React)

// Mount React App
const root = createRoot(document.getElementById('app'))
root.render(React.createElement(Home))
