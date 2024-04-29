import { formatTime } from '../format_time'
import { describe, it, expect } from 'vitest'

describe('format', () => {
	it('format time now', () => {
		const time = Date.now() - 1000
		expect(formatTime(time)).toBe('刚刚')
	})
})
