import { memo } from 'react'
import { Navigate } from 'react-router'

const Account = memo(() => {
	return <Navigate to="/account/login" replace />
})

export default Account
