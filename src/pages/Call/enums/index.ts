export enum MessageEventEnum {
	TIMER_START = 'timer_start',
	TIMER_CHANGE = 'time_change',
	TIMER_STOP = 'timer_stop',
	TIMEOUT = 'timeout'
}

export enum CallStatus {
	/** 空闲 */
	IDLE,
	/** 等待中 */
	WAITING,
	/** 被拒绝 */
	REFUSE,
	/** 通话中 */
	CALL,
	/** 被挂断 */
	HANGUP
}
