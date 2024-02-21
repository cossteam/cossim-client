/**
 * 将光标移动到给定 HTML 元素的末尾。
 *
 * @param {HTMLDivElement | null} el -将光标移动到末尾的 HTML 元素
 * @return {无效}
 */
export const moveCursorToEnd = (el: HTMLDivElement | null) => {
	if (!el) return
	if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
		// 创建一个文本范围
		const range = document.createRange()
		// 选择富文本框内的所有内容
		range.selectNodeContents(el)
		// 将范围折叠到其结束点，即将光标移动到最后
		range.collapse(false)
		// 创建一个选区
		const sel = window.getSelection()
		// 删除现有的选区
		sel?.removeAllRanges()
		// 将新的范围添加到选区
		sel?.addRange(range)
	}
}

/**
 * 获取当前光标的位置。
 * @param {HTMLDivElement | null} el -光标所在的 HTML 元素
 * @return {number}
 */
export const getCursorPosition = (el: HTMLDivElement | null) => {
	if (!el) return 0
	if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
		const range = window.getSelection()!.getRangeAt(0)
		const preCaretRange = range.cloneRange()
		preCaretRange.selectNodeContents(el)
		preCaretRange.setEnd(range.endContainer, range.endOffset)
		const start = preCaretRange.toString().length
		return start
	}
	return 0
}

// getSelection、createRange兼容
export function isSupportRange() {
	return typeof document.createRange === 'function' || typeof window.getSelection === 'function'
}

// 获取光标位置
export function getCurrentRange() {
	let range = null
	let selection = null
	if (isSupportRange()) {
		selection = document.getSelection()
		if (selection?.getRangeAt && selection.rangeCount) {
			range = document.getSelection()?.getRangeAt(0)
		}
	} else {
		// @ts-ignore
		range = document.selection.createRange()
	}
	return range
}

/**
 * 在指定位置上插入元素, 不要使用过期的 web api
 * @param {HTMLDivElement | null} el -插入元素的 HTML 元素
 * @param {number} position -插入元素的位置
 * @param {content} content -插入的内容(可以是 HTML 字符串)
 */
export const insertElement = (html: string) => {
	let selection = null
	let range = null
	if (isSupportRange()) {
		// IE > 9 and 其它浏览器
		selection = document.getSelection()
		if (selection?.getRangeAt && selection.rangeCount) {
			let node, lastNode
			range = selection.getRangeAt(0)
			range.deleteContents()
			const el = document.createElement('span')
			// el.innerHTML = html
			el.insertAdjacentHTML('afterbegin', html)
			// 创建空文档对象,IE > 8支持documentFragment
			const fragment = document.createDocumentFragment()

			while ((node = el.firstChild)) {
				lastNode = fragment.appendChild(node)
			}
			range.insertNode(fragment)

			if (lastNode) {
				range = range.cloneRange()
				range.setStartAfter(lastNode)
				range.collapse(true)
				selection.removeAllRanges()
				selection.addRange(range)
			}
		}
		// @ts-ignore 移开焦点
		document.activeElement?.blur()
		// @ts-ignore
	} else if (document.selection && document.selection.type != 'Control') {
		// @ts-ignore IE < 9
		document.selection.createRange().pasteHTML(html)
		// @ts-ignore 移开焦点
		document.activeElement?.blur()
	}
}
