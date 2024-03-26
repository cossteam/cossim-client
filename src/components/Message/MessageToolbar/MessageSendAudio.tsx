import { MicCircleFill } from 'framework7-icons/react'
import { Link } from 'framework7-react'
import { useRef, useState } from 'react'

// @See: https://github.com/tchvu3/capacitor-voice-recorder#readme
import { VoiceRecorder, RecordingData, GenericResponse } from 'capacitor-voice-recorder'
import { useAsyncEffect, useLongPress } from '@reactuses/core'
import { toastMessage } from '@/shared'

const MessageSendAudio = () => {
	const audioRef = useRef<HTMLDivElement | null>(null)

	const [isFristRender, setIsFristRender] = useState<boolean>(true)
	const [isRecording, setIsRecording] = useState<boolean>(false)

	const longPressEvent = useLongPress(async () => {
		// 请求权限
		const voiceRecord = await VoiceRecorder.requestAudioRecordingPermission()

		if (voiceRecord.value) {
			setIsRecording(true)
		} else {
			toastMessage('当前设备不支持录音')
			setIsRecording(false)
		}
	}, {})

	useAsyncEffect(
		async () => {
			if (isFristRender) return setIsFristRender(false)

			if (isRecording) {
				VoiceRecorder.startRecording()
					.then((result: GenericResponse) => console.log('start', result.value))
					.catch(() => toastMessage('录音失败'))
			} else {
				VoiceRecorder.stopRecording()
					.then((result: RecordingData) => console.log('stop', result.value))
					.catch()
			}
		},
		() => {},
		[isRecording]
	)

	return (
		<div
			ref={audioRef}
			{...longPressEvent}
			onTouchEnd={() => setIsRecording(false)}
			onTouchEndCapture={() => setIsRecording(false)}
			onContextMenu={(e) => e.preventDefault()}
			className="h-full flex items-center"
		>
			<Link>
				<MicCircleFill className="toolbar-btn animate__animated animate__zoomIn" />
			</Link>
		</div>
	)
}

export default MessageSendAudio
