import { registerRoute, Route } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'

self.addEventListener('activate', function (event) {
	console.log('ServiceWorker activated.', event)
})

self.addEventListener('message', (event) => {
	console.log('接收消息', event)
})

console.log('Service Worker Loaded')

// Handle images:
const imageRoute = new Route(
	({ request }) => {
		return request.destination === 'image'
	},
	new StaleWhileRevalidate({
		cacheName: 'images'
	})
)

// Handle scripts:
const scriptsRoute = new Route(
	({ request }) => {
		return request.destination === 'script'
	},
	new CacheFirst({
		cacheName: 'scripts'
	})
)

// Handle styles:
const stylesRoute = new Route(
	({ request }) => {
		return request.destination === 'style'
	},
	new CacheFirst({
		cacheName: 'styles'
	})
)

// Register routes
registerRoute(imageRoute)
registerRoute(scriptsRoute)
registerRoute(stylesRoute)
