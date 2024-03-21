import { f7 } from 'framework7-react'
import { Toast } from 'framework7/types'

/**
 * 弹出提示消息
 *
 * @param message   提示消息
 */
export function toastMessage(message: string, options?: Toast.Parameters) {
	const toast = f7.toast.create({
		text: message,
		position: 'center',
		closeTimeout: 1000,
		...options
	})

	// Open it
	toast.open()
}
