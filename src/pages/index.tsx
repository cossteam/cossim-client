import { memo } from 'react'
import { Navigate } from 'react-router'

const Home = memo(() => {
	return <Navigate to="/account/login" />
})

export default Home
