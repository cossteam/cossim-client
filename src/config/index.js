import routes from './routes'

/**
 * Framework7 Parameters
 * @type {Object}
 * @see https://framework7.io/docs/app#app-parameters
 */
const f7params = {
	name: 'Cossim',
	// ios, md, auto
	theme: 'auto',
	routes,
	darkMode: 'auto',
	// 默认主题
	colors: {
		primary: '#007aff'
	},
	serviceWorker:
		process.env.NODE_ENV === 'production'
			? {
					path: '/service-worker.js'
				}
			: {}
}

export default f7params
