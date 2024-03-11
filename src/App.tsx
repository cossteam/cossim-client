// import CommonDataBase from '@/cache'
import { useAsyncEffect } from '@reactuses/core'

function App() {
	useAsyncEffect(
		async () => {
			// console.log('CommonDataBase.get()', await CommonDataBase.common.add({ key: 'test', value: 1 }))
			// console.log('CommonDataBase.get()', await CommonDataBase.add({ cacheDialogs: [] }))

			// console.log('CommonDataBase.get()', await CommonDataBase.get())
		},
		() => {},
		[]
	)

	return 'qq'
}

export default App
