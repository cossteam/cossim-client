/** 自定义事件类型 */
export enum EventType {
    /** 内容改变 */
	CHANGE = 'editor:change',
    /** 编辑器人为聚焦 */
	FOCUS = 'editor:focus',
    /** @ 事件 */
    AITE = 'editor:aite',
    /** @ 结束 */
    AITE_END = 'editor:aite-end'
}
