import { $t } from '@/shared'

export async function hasMike() {
	try {
		return navigator?.mediaDevices?.getUserMedia({ video: false, audio: true })
	} catch (error: any) {
		console.log(error.code, error.message)
		throw Error(error?.message || $t('麦克风无法使用'))
	}
}

export async function hasCamera() {
	try {
		return navigator?.mediaDevices?.getUserMedia({ video: true, audio: false })
	} catch (error: any) {
		console.log(error)
		throw Error(error?.message || $t('摄像头无法使用'))
	}
}

export async function hasMediaDevices() {
	try {
		return navigator?.mediaDevices?.getUserMedia({ video: true, audio: true })
	} catch (error: any) {
		console.log(error)
		throw Error(error?.message || $t('麦克风或摄像头无法使用'))
	}
}

export async function checkMedia(checkCamera = false): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		hasMike()
			.then(() => {
				if (checkCamera) return hasCamera()
			})
			.then(() => {
				resolve()
			})
			.catch((e) => {
				reject(e)
			})
	})
}
