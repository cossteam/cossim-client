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
