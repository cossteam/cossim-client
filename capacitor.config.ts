import { CapacitorConfig } from '@capacitor/cli'
import { KeyboardResize } from '@capacitor/keyboard'

const config: CapacitorConfig = {
	appId: 'com.hitosea.coss',
	appName: 'COSS',
	webDir: 'dist',
	server: {
		androidScheme: 'https'
	},
	plugins: {
		LocalNotifications: {
			smallIcon: 'ic_stat_icon_config_sample',
			iconColor: '#488AFF',
			sound: 'beep.wav'
		},
		Keyboard: {
			resize: KeyboardResize.None,
			// style: KeyboardStyle.Dark,
			resizeOnFullScreen: true
		}
	}
}

export default config
