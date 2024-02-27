import Quill from 'quill'
import type { Delta } from 'quill/core'
import './quill.mention.scss'

interface MentionOptions {
	triggerChar?: string
	source?: () => Promise<any[]>
}

/**
 * @description 自定义提及
 *
 * @param quill
 * @param options
 */
class Mention {
	public static blotName = 'mention'
	public static className = 'ql-mention'
	public static tagName = 'div'

	private quill!: Quill
	private options!: MentionOptions

	private container!: HTMLDivElement | null

	constructor(quill: Quill, options: MentionOptions) {
		this.quill = quill
		this.options = options

		this.quill.on('text-change', this.handleTextChange.bind(this))
		document.body.addEventListener('click', () => this.clearContainer())
	}

	createNode(data: any[]) {
		const denotationChar = document.createElement('div')
		denotationChar.className = 'ql-mention-denotation-char'
		denotationChar.textContent = 'test'
		console.log('data', data)

		// const rect = this.quill.root.getBoundingClientRect()
		// denotationChar.style.top = `${rect.top}px`
		// console.log('rect', rect)
		// document.body.appendChild(denotationChar)
		// this.container = denotationChar

		// 获取光标所在位置
		const selection = this.quill.getSelection()
		if (!selection) return

		// 获取光标位置的坐标
		const bounds = this.quill.getBounds(selection.index)
		if (!bounds) return

		console.log('bounds', bounds,selection)

		// 设置 div 的位置
		denotationChar.style.position = 'absolute'
		denotationChar.style.left = `${bounds.left}px`
		denotationChar.style.top = `${bounds.top + bounds.height}px`

		console.log('bounds', bounds)
		document.body.appendChild(denotationChar)
		this.container = denotationChar
	}

	async handleTextChange(delta: Delta) {
		// 如果有上一次存留的 @
		this.clearContainer()

		console.log('delta', delta)

		const chat = delta.ops?.at(-1)?.insert
		if (!chat) return

		// 获取触发提及的字符（在这里为 '@'）
		const triggerChar = this.options.triggerChar || '@'
		if (triggerChar !== chat) return

		const mentionList = (this.options.source && (await this.options.source())) ?? []
		this.createNode(mentionList)
	}

	clearContainer() {
		if (!this.container) return
		this.container.remove()
		this.container = null
	}
}

export default Mention
