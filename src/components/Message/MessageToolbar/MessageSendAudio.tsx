import { MicFill } from 'framework7-icons/react'
import { useEffect, useRef, useState } from 'react'

// @See: https://github.com/tchvu3/capacitor-voice-recorder#readme
import { VoiceRecorder, RecordingData, GenericResponse } from 'capacitor-voice-recorder'
import { useAsyncEffect, useClickOutside } from '@reactuses/core'
import { MESSAGE_SEND, msgType, toastMessage } from '@/shared'
import clsx from 'clsx'
import useTouch from '@/hooks/useTouch'
import Timer from '@/components/LiveRoom/Timer'
import StorageService from '@/api/storage'
import { Base64 } from 'js-base64'
import useMessageStore from '@/stores/new_message'
import { generateMessage } from '@/utils/data'
import { sendMessage } from '../script/message'

let startTime: number
let endTime: number
const MessageSendAudio = () => {
	const audioRef = useRef<HTMLDivElement | null>(null)
	// 首次渲染
	const [isFristRender, setIsFristRender] = useState<boolean>(true)
	// 是否正在录音
	const [isRecording, setIsRecording] = useState<boolean>(false)
	// 划动监听
	const touch = useTouch()
	// 是否有权限
	const [isPermission, setIsPermission] = useState<boolean>(false)
	// 录音数据
	const [recordingData, setRecordingData] = useState<RecordingData | null>(null)

	const messageStore = useMessageStore()

	useAsyncEffect(
		async () => {
			const isPermission = await VoiceRecorder.hasAudioRecordingPermission()
			setIsPermission(isPermission.value)
		},
		() => {},
		[]
	)

	// 监听
	useEffect(() => {
		if (isFristRender) return setIsFristRender(false)

		if (isRecording) {
			VoiceRecorder.startRecording()
				.then((result: GenericResponse) => console.log('start', result.value))
				.catch(() => toastMessage('录音失败'))
			touch.start(document.getElementsByTagName('html')[0])
		} else {
			VoiceRecorder.stopRecording()
				.then((result: RecordingData) => setRecordingData(result))
				.catch()
		}
	}, [isRecording])

	useAsyncEffect(
		async () => {
			if (!recordingData || !recordingData.value || touch.isCancel) return // 取消发送

			try {
				console.log('recordingData', recordingData.value)
				if (recordingData.value.msDuration < 1000) return
				// 将Base64数据解码为二进制数据
				const decodedData = Base64.toUint8Array(recordingData.value.recordDataBase64)
				// 将解码后的数据包装为Blob对象
				const blob = new Blob([decodedData], { type: 'audio/webm' })
				const fileType = recordingData.value.mimeType.split(';')[0]
				const fileExten = fileType.split('/')[1]
				const file = new File([blob], `audio.${fileExten}`, { type: fileType })
				const messageContent = {
					mimeType: recordingData.value.mimeType,
					msDuration: recordingData.value.msDuration,
					recordDataBase64: recordingData.value.recordDataBase64,
					url: '',
					isBlob: false
				}
				const message = generateMessage({
					content: JSON.stringify(messageContent),
					msg_type: msgType.AUDIO,
					msg_send_state: MESSAGE_SEND.SENDING
				})
				messageStore.createMessage(message)
				const { code, data, msg } = await StorageService.uploadFile({ file, type: 0 })
				if (code !== 200) {
					toastMessage(msg)
					return
				}
				console.log(data)

				message.content = JSON.stringify({
					...messageContent,
					// recordDataBase64: '',
					url: data.url,
					isBlob: true
				})

				sendMessage({
					content: message.content,
					msg_type: msgType.AUDIO,
					uid: message.uid
				})
				// await messageStore.updateMessage({ ...message, msg_send_state: MESSAGE_SEND.SEND_SUCCESS })
			} catch (error) {
				console.log(error)
				toastMessage('发送失败')
			}
		},
		() => {},
		[recordingData]
	)

	useClickOutside(audioRef, () => setIsRecording(false))

	const handlerTouchStart = async () => {
		startTime = new Date().getTime()
		try {
			// 请求权限
			if (!isPermission) {
				const voiceRecord = await VoiceRecorder.requestAudioRecordingPermission()
				if (voiceRecord) setIsRecording(true)
				else throw new Error('请求权限失败')
			} else {
				setIsRecording(true)
			}
		} catch {
			toastMessage('当前设备不支持录音')
			setIsRecording(false)
		}
	}
	const handlerTouchEnd = () => {
		endTime = new Date().getTime()
		console.log(endTime, startTime)
		if (endTime - startTime < 1000) {
			toastMessage('说话时间太短了！')
		}
		setIsRecording(false)
	}

	return (
		<>
			<div
				ref={audioRef}
				onTouchStart={handlerTouchStart}
				onTouchEnd={handlerTouchEnd}
				className={clsx('flex items-center bg-primary rounded-full w-8 h-8 justify-center relative ')}
			>
				{/* isRecording && 'absolute !w-16 !h-16 right-1' */}
				<div
					className={clsx(
						'bg-primary rounded-full w-8 h-8 flex justify-center items-center',
						isRecording && 'absolute -top-4 -left-4 !w-16 !h-16 '
					)}
				>
					<MicFill
						onContextMenu={(e) => e.preventDefault()}
						className={clsx('toolbar-btn text-white text-2xl')}
					/>
				</div>
				{isRecording && (
					<div
						className={clsx(
							'w-40 h-24 p-4 rounded-lg select-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center',
							touch.isCancel ? 'bg-red-400 text-white' : ' bg-white text-black'
						)}
					>
						<div className="flex-1 flex flex-col justify-center items-center">
							<Timer className="text-2xl font-bold" />
						</div>
						<span>{touch.isCancel ? '松开手指取消' : '向上滑动取消录音'}</span>
					</div>
				)}
			</div>
		</>
	)
}

export default MessageSendAudio
