import { f7 } from 'framework7-react'
import { Toast } from 'framework7/types'
import { useRef } from 'react'

export const useToast = () => {
	const toastRef = useRef<any>(null)

	const toast = (text: string, options: Toast.Parameters = {}) => {
		toastRef.current = f7.toast.create({
			text,
			closeTimeout: 1000,
            position: 'center',
			...options
		})
		toastRef.current!.open()
	}

	return {
		toast
	}
}
