/**
 * 渲染元素的第一个子元素到页面
 *
 * @param {HTMLElement} parentEl     要渲染到的元素
 * @param {HTMLElement} renderEl     要渲染的元素
 */
export function appendFirstChild(parentEl: HTMLElement | null, renderEl: HTMLElement) {
	const observer = new MutationObserver(() => {
		const firstChild = renderEl.firstElementChild

		if (firstChild) {
			parentEl?.appendChild(firstChild)
			// 停止观察器
			observer.disconnect()
		} else {
			parentEl?.appendChild(renderEl)
		}
	})
	// 启动观察器，监听子节点的变化
	observer.observe(renderEl, { childList: true })
}

/**
 * 消息是否超过撤回时间
 *
 * @param {number}  time   消息时间
 * @param {number}  recall 撤回时间	单位：分钟，默认2分钟
 * @returns {boolean}
 */
export function isOverRecallTime(time: number, recall: number = 2) {
	const now = Date.now()
	const diff = now - time
	const diffMinute = diff / 1000 / 60
	return diffMinute > recall
}
