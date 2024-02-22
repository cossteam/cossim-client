type EventHandler = (event: Event) => void

class EventListenerMap {
	private listeners: Set<EventHandler>

	constructor() {
		this.listeners = new Set()
	}

	add(handler: EventHandler): void {
		this.listeners.add(handler)
	}

	/**
	 * 将事件处理程序添加到侦听器列表中。
	 *
	 * @param {EventHandler} handler -要添加的事件处理程序
	 * @return {无效}
	 */
	delete(handler: EventHandler): void {
		this.listeners.delete(handler)
	}

	/**
	 * 获取监听器的大小。
	 *
	 * @return {number} 监听器的大小
	 */
	get size(): number {
		return this.listeners.size
	}

	[Symbol.iterator]() {
		return this.listeners.values()
	}
}

/**
 * 元素事件监听器
 */
class ElementEventListeners {
	private events: Map<string, Map<string, EventListenerMap>>
	private customEvents: Map<string, Event>

	constructor(private element: HTMLElement) {
		this.events = new Map()
		this.customEvents = new Map()
	}

	/**
	 * 添加事件监听器
	 *
	 * @param {string} eventType -要监听的事件类型
	 * @param {EventHandler} eventHandler -处理事件的函数
	 * @return
	 */
	addEventListener(eventType: string, eventHandler: EventHandler): void {
		const elementId = this.element.id || 'anonymous'
		let elementMap = this.events.get(elementId)
		if (!elementMap) {
			elementMap = new Map()
			this.events.set(elementId, elementMap)
		}
		let eventMap = elementMap.get(eventType)
		if (!eventMap) {
			eventMap = new EventListenerMap()
			elementMap.set(eventType, eventMap)
		}
		eventMap.add(eventHandler)
		this.element.addEventListener(eventType, eventHandler)
	}

	/**
	 * 移除事件监听器
	 *
	 * @param {string} eventType -要删除的事件类型
	 * @param {EventHandler} eventHandler -要删除的事件处理函数
	 * @return {void}
	 */
	removeEventListener(eventType: string, eventHandler: EventHandler): void {
		const elementId = this.element.id || 'anonymous'
		const elementMap = this.events.get(elementId)
		if (elementMap) {
			const eventMap = elementMap.get(eventType)
			if (eventMap) {
				eventMap.delete(eventHandler)
				this.element.removeEventListener(eventType, eventHandler)
				if (eventMap.size === 0) {
					elementMap.delete(eventType)
					if (elementMap.size === 0) {
						this.events.delete(elementId)
					}
				}
			}
		}
	}

	/**
	 * 获取附加到给定元素的所有事件侦听器。
	 *
	 * @return {Map<string, EventListenerMap>} 给定元素的事件类型到事件侦听器的映射
	 */
	getAllEventListeners(): Map<string, EventListenerMap> {
		const elementId = this.element.id || 'anonymous'
		return this.events.get(elementId) || new Map()
	}

	/**
	 * 销毁所有事件侦听器
	 *
	 * @return {void}
	 */
	destroy(): void {
		for (const [elementId, elementMap] of this.events.entries()) {
			for (const [eventType, eventMap] of elementMap.entries()) {
				for (const eventHandler of eventMap) {
					elementMap.delete(eventType)
					this.element.removeEventListener(eventType, eventHandler)
				}
			}
			if (elementMap.size === 0) {
				this.events.delete(elementId)
			}
		}
	}

	/**
	 * 自定义监听器
	 *
	 * @param {string} eventType - 事件类型
	 * @param {EventHandler} eventHandler -要删除的事件处理函数
	 * @param {any} options - 回调函数
	 * @return
	 */
	addCustomEventListener(eventType: string, eventHandler?: EventHandler, options: any = {}) {
		const customEvent = new Event(eventType, {
			bubbles: true, // 是否冒泡
			cancelable: true, // 是否可取消
			...options
		})

		const defaultEventHandler = () => null
		this.addEventListener(eventType, eventHandler ?? defaultEventHandler)
		this.customEvents.set(eventType, customEvent)
	}

	/**
	 * 删除自定义监听器
	 *
	 * @param {string} eventType - 事件类型
	 * @param {EventHandler} eventHandler -要删除的事件处理函数
	 * @return {void}
	 */
	removeCustomEventListener(eventType: string, eventHandler: EventHandler) {
		this.removeEventListener(eventType, eventHandler)
	}

	/**
	 * 触发自定义事件
	 *
	 * @param {Event} customEvent - 自定义事件
	 * @return
	 */
	triggerCustomEvent(name: string) {
		const customEvent = this.customEvents.get(name)
		if (customEvent) {
			this.element.dispatchEvent(customEvent)
		}
	}
}

export default ElementEventListeners
