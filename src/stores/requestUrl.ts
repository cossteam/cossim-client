

let baseUrl: string =  'https://coss.gezi.vip/api/v1'
let wsUrl: string = 'wss://coss.gezi.vip/api/v1/push/ws'

export const getBaseUrl = () => {
	return baseUrl || localStorage.getItem('base_url') || 'https://coss.gezi.vip/api/v1'
}
export const getWsUrl = () => {
	return wsUrl || localStorage.getItem('ws_url') || 'wss://coss.gezi.vip/api/v1/push/ws'
}
export const setBaseUrl = (url: string) => {
	if (url) {
		baseUrl = url
		localStorage.setItem('base_url', url)
	}
}
export const setWsUrl = (url: string) => {
	if (url) {
		wsUrl = url
		localStorage.setItem('ws_url', url)
	}
}


