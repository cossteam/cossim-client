export function useClipboard(text) {
	let flag = true
	if (navigator.clipboard) {
		try {
			// 复制成功
			navigator.clipboard.writeText(text)
		} catch {
			// 复制失败
			flag = false
		}
	} else {
		const textArea = document.createElement('textarea')
		textArea.value = text
		document.body.appendChild(textArea)
		textArea.focus()
		textArea.select()
		try {
			// 复制成功
			document.execCommand('copy')
		} catch {
			flag = false
		} finally {
			document.body.removeChild(textArea)
		}
	}

	return flag
}
