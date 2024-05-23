import { CapacitorConfig } from '@capacitor/cli'
// import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard'

const config: CapacitorConfig = {
	appId: 'com.hitosea.coss',
	appName: 'COSS',
	webDir: 'dist',
	server: {
		// url: 'http://192.168.100.191:5173/',
		// cleartext: true
		// androidScheme: 'https'
	},
	plugins: {
		// LocalNotifications: {
		// 	smallIcon: 'ic_stat_icon_config_sample',
		// 	iconColor: '#488AFF',
		// 	sound: 'beep.wav'
		// }
		// Keyboard: {
		// 	resize: KeyboardResize.Body,
		// 	style: KeyboardStyle.Dark,
		// 	resizeOnFullScreen: true
		// }
	}
}

export default config
