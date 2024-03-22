import { f7 } from 'framework7-react'
import { Toast } from 'framework7/types'
import { $t } from '.'

/**
 * 弹出提示消息
 *
 * @param message   提示消息
 */
export function toastMessage(message: string, options?: Toast.Parameters) {
	const toast = f7.toast.create({
		text: $t(message),
		position: 'center',
		closeTimeout: 1000,
		...options
	})

	// Open it
	toast.open()
}

/**
 * 弹出对话框
 *
 * @param message   提示消息
 * @param title     提示标题
 */
export function confirmMessage(message: string, title: string, ok?: () => void, cancel?: () => void) {
	f7.dialog.confirm(
		$t(message),
		title,
		() => ok && ok(),
		() => cancel && cancel()
	)
}
