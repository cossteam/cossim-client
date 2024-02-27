import DOMPurify from 'dompurify'

class CustomRange extends Range {
	constructor(private el: HTMLDivElement | null) {
		super()
	}

	/**
	 * 检查浏览器是否支持 Range API 或 Selection API。
	 *
	 * @return {boolean} 如果浏览器支持 Range API 或 Selection API，则为 true，否则为 false
	 */
	private isSupportRange() {
		return typeof document.createRange === 'function' || typeof window.getSelection === 'function'
	}

	/**
	 * 将光标移至末尾
	 */
	moveToEnd() {
		if (!this.el) return
		if (this.isSupportRange()) {
			// 创建一个文本范围
			const range = document.createRange()
			// 选择富文本框内的所有内容
			range.selectNodeContents(this.el)
			// 将范围折叠到其结束点，即将光标移动到最后
			range.collapse(false)
			// 创建一个选区
			const sel = window.getSelection()
			// 删除现有的选区
			sel?.removeAllRanges()
			// 将新的范围添加到选区
			sel?.addRange(range)
		} else {
			// @ts-ignore
			this.el.selectionStart = this.el.value.length
			// @ts-ignore
			this.el.selectionEnd = this.el.value.length
		}
	}

	/**
	 * 获取当前光标的位置
	 *
	 * @returns 光标的位置
	 */
	getPosition() {
		let range = null
		let selection = null
		if (this.isSupportRange()) {
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
	 * 插入元素
	 *
	 * @param {string} html - 要插入的元素字符串
	 * @param {string} tagName - 要插入的元素标签名
	 * @param { boolean } isFocus - 插入元素后是否聚焦
	 */
	insertElement(html: string, tagName: string = 'span', isFocus: boolean = false) {
		this.el?.focus()
		let selection = null
		let range = null
		if (this.isSupportRange()) {
			// IE > 9 和其他浏览器
			selection = document.getSelection()
			if (selection?.getRangeAt && selection.rangeCount) {
				let node, lastNode
				range = selection.getRangeAt(0)
				range.deleteContents()

				// 解析 HTML 字符串以获取元素
				const tempEl = document.createElement('div')
				tempEl.innerHTML = html

				// 获取第一个子元素
				const el = tempEl.firstChild as HTMLElement

				// 使用 DOMPurify 清理除了特定属性之外的其他内容
				const cleanedHtml = DOMPurify.sanitize(html)

				// 将保留的属性添加回元素
				const sanitizedHtml = cleanedHtml.replace(/<[a-z]+/i, (match) => {
					const attributeNames = Array.from(el?.attributes || []).map(
						(attr) => `${attr.nodeName}="${attr.nodeValue}"`
					)
					return match + ' ' + attributeNames.join(' ')
				})

				const finalEl = document.createElement(tagName)
				finalEl.insertAdjacentHTML('afterbegin', sanitizedHtml)
				const fragment = document.createDocumentFragment()
				while ((node = finalEl.firstChild)) {
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
			// @ts-ignore 如果 isFocus 为 false，则模糊焦点
			!isFocus && document.activeElement?.blur()
			// @ts-ignore
		} else if (document.selection && document.selection.type != 'Control') {
			// @ts-ignore 对于 IE < 9
			document.selection.createRange().pasteHTML(html)
			// @ts-ignore 如果 isFocus 为 false，则模糊焦点
			!isFocus && document.activeElement?.blur()
		}
	}

	/**
	 * 移除当前选区前一个元素
	 *
	 */
	removeElement() {
		let range = null
		let selection = null
		if (this.isSupportRange()) {
			selection = document.getSelection()
			if (selection?.getRangeAt && selection.rangeCount) {
				range = document.getSelection()?.getRangeAt(0)
				// 获取当前选区的起始位置
				const startOffset = range!.startOffset
				// 如果起始位置为 0，说明光标在节点的开头，无法删除前一个节点
				if (startOffset === 0) {
					return
				}
				// 获取当前选区的父节点
				const parent = range!.commonAncestorContainer
				// 获取光标前一个节点
				const nodeBeforeCursor = parent?.childNodes[startOffset - 1]
				if (nodeBeforeCursor) {
					// 从父节点中移除光标前一个节点
					parent?.removeChild(nodeBeforeCursor)
				}
			}
		} else {
			// @ts-ignore 如果不支持 Range API 或 Selection API 的处理逻辑，例如使用 document.selection
			const selection = document.selection
			if (selection) {
				const range = selection.createRange()
				// 将选区移动到前一个元素
				range.moveStart('character', -1)
				range.text = '' // 删除前一个元素
			}
		}
	}
}

export default CustomRange
