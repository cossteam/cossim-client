import useCommonStore from '@/stores/common'
import { useEffect } from 'react'
import { useParams, useLocation } from 'react-router'

function useDialogHistory() {
	const params = useParams()
	const location = useLocation()
	const commonStore = useCommonStore()

	useEffect(() => {
		if (location.pathname.includes('dashboard') && params?.id) {
			commonStore.update({ lastDialogId: Number(params.id || 0) })
		}
	}, [params?.id, location.pathname])
}

export default useDialogHistory
