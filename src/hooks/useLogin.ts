import useUserStore from '@/stores/user'
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'

function useLogin() {
	const userStore = useUserStore()
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		if (!userStore.token) {
			if (location.pathname.includes('account')) return
			navigate(`/account/login`)
		}
	}, [userStore.token, location])
}

export default useLogin
