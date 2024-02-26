export async function hasMediaDevices() {
	return navigator.mediaDevices.getUserMedia({ video: true, audio: true })
}
