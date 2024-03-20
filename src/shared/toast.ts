import toast, { Toast } from 'react-hot-toast'

/**
 * 弹出提示消息
 *
 * @param message   提示消息
 */
export function toastMessage(message: string, options?: Toast) {
	toast(message, {
		duration: 2000,
		position: 'top-center',
		...options
	})
}
