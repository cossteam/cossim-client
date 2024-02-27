import ElementEventListeners from './event'
import CustomRange from './range'
import { EventType } from '../shared'

import DOMPurify from 'dompurify'

export interface EditorOptions {
	placeholder?: string
	maxHieght?: string
	readonly?: boolean
	initValue?: string
	change?: (value: string) => void
}

class Editor {
	public el!: HTMLDivElement
	private eventListeners!: ElementEventListeners
	private range: CustomRange
	private isFocus: boolean = false

	get readonly() {
		return this.el.contentEditable === 'false'
	}

	set readonly(v: boolean) {
		this.el.contentEditable = v ? 'false' : 'true'
	}

	constructor(el: HTMLDivElement, options?: EditorOptions) {
		if (!el) throw new Error('el is required')
		this.el = el

		this.eventListeners = new ElementEventListeners(el)
		this.range = new CustomRange(el)

		// 初始化
		this.el.dataset.placeholder = options?.placeholder ?? '请输入内容'
		this.el.style.maxHeight = options?.maxHieght ?? 'auto'

		if (options?.initValue) {
			this.insertElement(options.initValue, { render: true })
		}
		this.el.classList.add('custom-editor')
		this.readonly = options?.readonly ?? false

		// 特殊配置
		if (!options?.readonly) {
			this.readonly = false
		}

		// @
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

		// 输入内容变化
		this.eventListeners.addCustomEventListener(EventType.CHANGE)
		// 聚焦
		this.eventListeners.addCustomEventListener(EventType.FOCUS)
		// @ 开始
		this.eventListeners.addCustomEventListener(EventType.AITE)
		// @ 结束
		this.eventListeners.addCustomEventListener(EventType.AITE_END)

		let is_at = false
		this.on('input', (e) => {
			this.eventListeners.triggerCustomEvent(EventType.CHANGE)

			if (e.data === '@') {
				// this.range.removeElement()
				this.insertElement('<p class="at"><p>', { isFocus: true })
				this.eventListeners.triggerCustomEvent(EventType.AITE)
				is_at = true
				return
			}

			// @ 结束
			if (is_at) {
				this.eventListeners.triggerCustomEvent(EventType.AITE_END)
				is_at = false
			}
		})

		document.addEventListener('click', () => {
			if (is_at) {
				this.eventListeners.triggerCustomEvent(EventType.AITE_END)
				is_at = false
			}
		})

		this.on('focus', () => {
			if (this.isFocus) return
			this.eventListeners.triggerCustomEvent(EventType.FOCUS)
		})
		this.on('click', () => {
			this.eventListeners.triggerCustomEvent(EventType.FOCUS)
		})
		this.on('blur', () => (this.el.contentEditable = 'false'))

		// 处理粘贴
		this.on('paste', (e: ClipboardEvent) => {
			// @ts-ignore
			if (!e.clipboardData || !window?.clipboardData) return

			const getData = (dataType: string) => e.clipboardData?.getData(dataType) || null

			// 如果是粘贴文本
			if (getData('text/plain')) {
				e.preventDefault()
				const text = getData('text/plain')
				const html = DOMPurify.sanitize(text as string)
				this.insertElement(html)
				return
			}
		})

		// this.on('keydown', (event: KeyboardEvent) => {
		// 	// 如果按下回车键
		// 	if (event.key === 'Enter') {
		// 		event.preventDefault() // 阻止默认行为
		// 		// 在这里添加你的自定义逻辑，例如插入特定的标签或处理输入内容
		// 		this.insertElement('<p></p>', { isFocus: true })
		// 	}

		// 	// 如果按下退格键，并且编辑器内容为空
		// 	else if (event.key === 'Backspace' && this.isEmpty()) {
		// 		event.preventDefault() // 阻止默认行为
		// 		// 针对空内容时的删除操作进行处理，比如保留最后一个 <p> 标签
		// 		this.handleEmptyContentDelete()
		// 	}
		// })
	}

	/**
	 * 插入元素
	 *
	 * @param {string} html - 要插入的元素字符串
	 * @param {string} tagName - 要插入的元素标签名
	 * @param { boolean } isFocus - 插入元素后是否聚焦
	 */
	insertElement(html: string, options?: { tagName?: string; isFocus?: boolean; render?: boolean }) {
		this.isFocus = true
		options?.render
			? (this.el.innerHTML = DOMPurify.sanitize(html))
			: this.range.insertElement(html, options?.tagName, options?.isFocus)
		this.isFocus = false
		this.eventListeners.triggerCustomEvent(EventType.CHANGE)
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
		this.eventListeners.triggerCustomEvent(EventType.CHANGE)
	}

	isEmpty() {
		return !this.el.textContent?.trim() && !this.el.innerHTML
	}

	on(envet: string, callback: (event: any) => void) {
		this.eventListeners.addEventListener(envet, callback.bind(this))
	}

	destroy() {
		this.eventListeners.destroy()
	}
}

export default Editor
