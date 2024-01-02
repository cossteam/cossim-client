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
        primary: '#007aff',
        red: '#ff3b30',
        green: '#4cd964',
        blue: '#2196f3',
        pink: '#ff2d55',
        yellow: '#ffcc00',
        orange: '#ff9500',
        purple: '#9c27b0',
        deeppurple: '#673ab7',
        lightblue: '#5ac8fa',
        teal: '#009688',
        lime: '#cddc39',
        deeporange: '#ff6b22',
        white: '#ffffff',
        black: '#000000',
	},
	serviceWorker:
		process.env.NODE_ENV === 'production'
			? {
					path: '/service-worker.js'
				}
			: {}
}

export default f7params
