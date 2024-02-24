let timerClear: (() => void) | null = null

self.onmessage = function (messageParams: MessageEvent) {
	console.log('Worker收到', messageParams.data)
	const { event, data } = messageParams.data
	console.log(event)

	switch (event) {
		case 'timer_start':
			{
				const duration = data?.duration || 0
				timerClear = timer(duration)()
			}
			break
		case 'timer_stop':
			timerClear && timerClear()
			break
	}
}

function timer(duration: number): () => () => void {
	let intervalId: any = null
	let timeoutId: any = null
	let remainder = 0
	try {
		remainder = duration / 1000
	} catch {
		remainder = 0
	}
	console.log('开始计时')
	return () => {
		intervalId = setInterval(() => {
			remainder -= 1
			console.log('剩余', remainder)

			self.postMessage({
				event: 'time_change',
				data: {
					remainder
				}
			})
		}, 1000)
		timeoutId = setTimeout(() => {
			self.postMessage({
				event: 'timeout',
				data: null
			})
			clearInterval(intervalId)
			clearTimeout(timeoutId)
		}, duration)
		return () => {
			clearInterval(intervalId)
			clearTimeout(timeoutId)
		}
	}
}
