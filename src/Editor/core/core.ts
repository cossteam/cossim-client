import ElementEventListeners from './event'
import CustomRange from './range'

import DOMPurify from 'dompurify'

export interface EditorOptions {
	placeholder?: string
	maxHieght?: string
	readonly?: boolean
	initValue?: string
}

class Editor {
	private el!: HTMLDivElement
	private eventListeners!: ElementEventListeners
	public range: CustomRange
	private isChange!: boolean

	constructor(el: HTMLDivElement, options?: EditorOptions) {
		if (!el) throw new Error('el is required')
		this.el = el

		this.eventListeners = new ElementEventListeners(el)
		this.range = new CustomRange(el)

		// 初始化
		this.el.dataset.placeholder = options?.placeholder ?? '请输入内容'
		this.el.style.maxHeight = options?.maxHieght ?? 'auto'

		if (options?.initValue) {
            this.insertElement(options.initValue,{ render: true })
		}

		this.el.contentEditable = options?.readonly ? 'false' : 'true'
		this.el.classList.add('custom-editor')

		// this.on('input', (e) => {
		// 	if (e.data === '@') {
		// 		const rect = this.el.getBoundingClientRect()
		// 		console.log('rect', rect)
		// 		const div = document.createElement('div')
		// 		div.classList.add('tooltips')
		// 		div.style.left = `${rect.left}px`
		// 		div.style.top = `${rect.top - 100}px`
		// 		div.innerHTML = '暂不支持'
		// 		document.body.appendChild(div)
		// 	} else {
		// 		document.body.removeChild(document.querySelector('.tooltips')!)
		// 	}
		// })

		this.on('input', () => {
			if (this.isEmpty()) this.isChange = false
		})
	}

	/**
	 * 插入元素
	 *
	 * @param {string} html - 要插入的元素字符串
	 * @param {string} tagName - 要插入的元素标签名
	 * @param { boolean } isFocus - 插入元素后是否聚焦
	 */
	insertElement(html: string, options?: { tagName?: string; isFocus?: boolean; render?: boolean }) {
		this.isChange = true
		options?.render
			? (this.el.innerHTML = DOMPurify.sanitize(html))
			: this.range.insertElement(html, options?.tagName, options?.isFocus)
	}

	focus() {
		this.el.focus()
	}

	toValue() {
		return this.el.innerHTML
	}

	toText() {
		return this.el.textContent
	}

	clear() {
		this.el.innerHTML = ''
	}

	isEmpty() {
		return !this.el.textContent?.trim()
	}

	on(envet: string, callback: (event: any) => void) {
		this.eventListeners.addEventListener(envet, callback.bind(this))
	}

	destroy() {
		this.eventListeners.destroy()
	}
}

export default Editor
