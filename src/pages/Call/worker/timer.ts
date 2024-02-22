const Duration = self as unknown as { duration: number }

self.onmessage = function (event: MessageEvent) {
	console.log('Worker收到', event)

	const { duration } = event.data as typeof Duration
	setTimeout(() => {
		self.postMessage('timeout')
	}, duration)
}
