import { useEffect, useRef, useState } from 'react'
import Recorder from 'recorder-core'
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/engine/mp3-engine'
import 'recorder-core/src/extensions/waveview'

interface AudioData {
	url: string
	blob: Blob
	duration: number
	file: File
}

interface SpeechRecognition {
	startRecording: () => void
	stopRecording: () => void
	audioData: AudioData | null
	isRecording: boolean
	error: string | null
	loading: boolean
}

const useSpeechRecognition = (): SpeechRecognition => {
	const rec = useRef<any | null>(null)
	const wave = useRef<any>(null)
	const [isRecording, setIsRecording] = useState<boolean>(false)
	const [audioData, setAudioData] = useState<AudioData | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)

	/** 开始 */
	const startRecording = () => {
		setLoading(true)

		if (!rec.current) open()

		rec.current.open(
			() => {
				//打开麦克风授权获得相关资源
				rec.current.start()

				//创建可视化，指定一个要显示的div
				if (Recorder.WaveView && document.querySelector('.recwave'))
					wave.current = Recorder.WaveView({
						elem: '.recwave',
						lineCount: 90,
						widthRatio: 1,
						position: 0,
						minHeight: 1,
						fallDuration: 600,
						stripeEnable: false,
						mirrorEnable: true,
						linear: [0, '#0ac', 1, '#0ac']
					})
			},
			(msg: string, isUserNotAllow: boolean) => {
				setIsRecording(false)
				setError(msg)
				//用户拒绝未授权或不支持
				console.log((isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg)
			}
		)
		setIsRecording(true)
	}

	/**结束录音**/
	const stopRecording = () => {
		try {
			rec.current.stop(
				(blob: Blob, duration: number) => {
					//简单利用URL生成本地文件地址，注意不用了时需要revokeObjectURL，否则霸占内存
					const localUrl = (window.URL || webkitURL).createObjectURL(blob)
					// console.log(blob, localUrl, '时长:' + duration + 'ms', wave.current)
					const fileName = `${Math.random().toString(36).substring(6)}.mp3`
					const file = new File([blob], fileName, { type: 'audio/mp3' })
					setAudioData({ url: localUrl, duration: duration, blob, file })

					console.log('录音成功：', audioData)
				},
				(msg: string) => {
					console.log('录音失败:' + msg)

					setError(msg)
				}
			)
		} catch (error: any) {
			setError(error.message)
		} finally {
			//释放录音资源
			rec.current?.close()
			rec.current = null
			setIsRecording(false)
		}
	}

	const open = () => {
		rec.current = Recorder({
			type: 'mp3',
			sampleRate: 16000,
			bitRate: 16,
			// @ts-ignore
			onProcess: (buffers, powerLevel, bufferDuration, bufferSampleRate) => {
				//可实时绘制波形（extensions目录内的waveview.js、wavesurfer.view.js、frequency.histogram.view.js插件功能）
				setLoading(false)
				wave.current && wave.current.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate)
			}
		})
	}

	useEffect(() => {
		// open()

		return () => {
			rec.current && rec.current.close()
		}
	}, [])

	return {
		startRecording,
		stopRecording,
		audioData,
		isRecording,
		error,
		loading
	}
}

export default useSpeechRecognition
