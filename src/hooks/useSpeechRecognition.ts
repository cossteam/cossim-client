import { useRef, useState } from 'react'
import Recorder from 'recorder-core'
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/engine/mp3-engine'
import 'recorder-core/src/extensions/waveview'

interface AudioData {
	url: string
	blob: Blob
	duration: number
	data: FormData
}

interface SpeechRecognition {
	startRecording: () => void
	stopRecording: () => void
	audioData: AudioData | null
	wave: any
	isRecording: boolean
}

const useSpeechRecognition = (): SpeechRecognition => {
	const rec = useRef<any | null>(null)
	const wave = useRef<any>(null)
	const [isRecording, setIsRecording] = useState<boolean>(false)
	const [audioData, setAudioData] = useState<AudioData | null>(null)

	/** 开始 */
	const startRecording = () => {
		rec.current = Recorder({
			type: 'mp3',
			sampleRate: 16000,
			bitRate: 16,
			// @ts-ignore
			onProcess: (buffers, powerLevel, bufferDuration, bufferSampleRate) => {
				//可实时绘制波形（extensions目录内的waveview.js、wavesurfer.view.js、frequency.histogram.view.js插件功能）
				wave.current && wave.current.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate)
			}
		})

		rec.current.open(
			() => {
				//打开麦克风授权获得相关资源
				rec.current.start()

				//创建可视化，指定一个要显示的div
				if (Recorder.WaveView) wave.current = Recorder.WaveView({ elem: '.recwave' })
			},
			(msg: string, isUserNotAllow: boolean) => {
				setIsRecording(false)
				//用户拒绝未授权或不支持
				console.log((isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg)
			}
		)
		setIsRecording(true)
		// rec.current.start()
	}

	/**结束录音**/
	const stopRecording = () => {
		if (!rec.current) return
		rec.current.stop(
			(blob: Blob, duration: number) => {
				//简单利用URL生成本地文件地址，注意不用了时需要revokeObjectURL，否则霸占内存
				const localUrl = (window.URL || webkitURL).createObjectURL(blob)
				console.log(blob, localUrl, '时长:' + duration + 'ms', wave.current)

				const fileName = `${Math.random().toString(36).substring(6)}.mp3`
				const file = new File([blob], fileName)
				const data = new FormData()
				data.append('file', file, fileName)

				console.log('file', file, data)

				//释放录音资源
				rec.current.close()
				rec.current = null
				setAudioData({ url: localUrl, duration: duration, blob: blob, data })
				setIsRecording(false)
			},
			(msg: string) => {
				console.log('录音失败:' + msg)
				rec.current.close()
				rec.current = null
				setIsRecording(false)
			}
		)
	}

	return {
		startRecording,
		stopRecording,
		audioData,
		wave,
		isRecording
	}
}

export default useSpeechRecognition
