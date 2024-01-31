export default class Editor {
	el = null
	options = {}

	/**
	 * 编辑器参数
	 * @param {HTMLDivElement} el    div 元素
	 * @param {Options} options      其他配置
	 * @param {Options} options.defineHeight  编辑器默认高度
	 * @param {Options} options.defineWidth  编辑器默认宽度
	 * @param {Options} options.placeholder  编辑器默认占位
	 */
	constructor(el, options) {
		this.options = options
		if (el) this.init(el)
	}

	/**
	 * 通过启用内容编辑并根据选项设置高度来初始化组件。
	 */
	init(el) {
		this.el = el
		this.el.contentEditable = true
		this.el.height = this.options.defineHeight || '42px'
		this.el.width = this.options.defineWidth || '100%'
		this.el.setAttribute('data-placeholder', this.options.placeholder)
		this.el.addEventListener('input', this.onChange.bind(this))
	}

	/**
	 * 输入框变化
	 */
	onChange(e) {
		this.el.style.height = this.options.defineHeight || '42px'
		this.el.style.height = e.target.scrollHeight + 'px'
		this.el.style.overflow = e.target.scrollHeight >= 150 ? 'auto' : 'hidden'
	}

	/**
	 * 聚焦输入框
	 * @returns
	 */
	focus() {
		this.el.focus()
		return this
	}

	/**
	 *  将指定节点插入到光标位置
	 * @param {DOM} fileDom dom节点
	 */
	insertNode(dom) {
		// 获取光标
		const selection = window.getSelection()
		// 获取选中的内容
		const range = selection.getRangeAt(0)
		// 删除选中的内容
		range.deleteContents()
		// 将节点插入范围最前面添加节点
		range.insertNode(dom)
		// 将光标移到选中范围的最后面
		selection.collapseToEnd()
	}

	insertEmoji() {}

	/**
	 * 清空输入框元素
	 * @returns
	 */
	clear() {
		this.el.innerHTML = ''
		return this
	}

	/**
	 * 监听事件
	 * @param {string} type  类型
	 * @param {Function} fn    回调函数
	 */
	on(type, fn) {
		this.el.addEventListener(type, fn.bind(this))
	}

	/**
	 * 销毁
	 * @returns
	 */
	destroy() {
		this.el.removeEventListener('input', this.onChange)
		this.el = null
	}
}
