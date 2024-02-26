export async function hasMike() {
	return navigator.mediaDevices.getUserMedia({ video: false, audio: true })
}

export async function hasCamera() {
	return navigator.mediaDevices.getUserMedia({ video: true, audio: false })
}

export async function hasMediaDevices() {
	return navigator.mediaDevices.getUserMedia({ video: true, audio: true })
}
