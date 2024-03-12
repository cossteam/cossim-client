import { useRef, useState } from 'react'
import Recorder from 'recorder-core'
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/engine/mp3-engine'
import 'recorder-core/src/extensions/waveview'

interface SpeechRecognition {
	startRecording: () => void
	stopRecording: () => void
	audioData: Blob | null
	wave: any
	isRecording: boolean
}

const useSpeechRecognition = (): SpeechRecognition => {
	const rec = useRef<any | null>(null)
	const wave = useRef<any>(null)
	const [isRecording, setIsRecording] = useState<boolean>(false)
	const [audioData, setAudioData] = useState<Blob | null>(null)

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
				//用户拒绝未授权或不支持
				console.log((isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg)
			}
		)
		setIsRecording(true)
		rec.current.start()
	}

	/**结束录音**/
	const stopRecording = () => {
		if (!rec.current) return
		rec.current.stop(
			(blob: Blob, duration: number) => {
				//简单利用URL生成本地文件地址，注意不用了时需要revokeObjectURL，否则霸占内存
				const localUrl = (window.URL || webkitURL).createObjectURL(blob)

				// 生成地址
				const formData = new FormData()
				formData.append('file', blob, 'recorder.mp3')

				console.log('formData', formData)

				console.log(blob, localUrl, '时长:' + duration + 'ms', wave.current)
				//释放录音资源
				rec.current.close()
				rec.current = null
				setAudioData(blob)
				setIsRecording(false)
			},
			(msg: string) => {
				console.log('录音失败:' + msg)
				rec.current.close()
				rec.current = null
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
