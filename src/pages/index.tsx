import { memo } from 'react'
import { Navigate } from 'react-router'

const Home = memo(() => {
	return <Navigate to="/dashboard" replace />
})

export default Home
