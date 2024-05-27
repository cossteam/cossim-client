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
			navigate(`/account/login`, {
				replace: true
			})
		} else {
			if (location.pathname.includes('account')) {
				navigate(`/dashboard`, {
					replace: true
				})
			}
		}
	}, [userStore.token, location])
}

export default useLogin
