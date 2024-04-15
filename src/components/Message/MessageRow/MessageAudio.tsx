import clsx from 'clsx'
import { Icon } from 'framework7-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import lottie from 'lottie-web'

interface MessageAudioProps {
	className?: string
	item: { [key: string]: any }
	isSelf?: boolean
}

// {
//     "mimeType": "audio/webm;codecs=opus",
//     "msDuration": 5280,
//     "recordDataBase64": "",
//     "url": "https://coss.gezi.vip/api/v1/storage/files/download/audio/23795966-8e52-4243-a38a-2b66ea3be340.webm",
//     "isBlob": true
// }

const MessageAudio: React.FC<MessageAudioProps> = ({ className, item, isSelf }) => {
	const audioRef = useRef<HTMLAudioElement>(null)

	const content = useMemo(() => {
		try {
			const _content = JSON.parse(item.content)
			return _content
		} catch (error) {
			return null
		}
	}, [item.content])

	const duration = useMemo(() => {
		if (!content?.msDuration) {
			return ''
		}
		return `${Math.floor(content.msDuration / 1000)}''`
	}, [content?.msDuration])

	// 图标
	const icons = useMemo(() => ['speaker', 'speaker_1', 'speaker_2', 'speaker_3'], [])
	const [iconIndex, setIconIndex] = useState(3)
	// const [timer, setTimer] = useState<any>(null)
	// 播放
	const [isPlay, setIsPlay] = useState<boolean>(false)
	const play = () => {
		console.log(content, isPlay ? '执行暂停' : '执行播放')
		if (!isPlay) {
			audioRef.current?.play()
		} else {
			audioRef.current?.pause()
		}
	}
	// 监听播放
	const playListener = () => {
		setIsPlay(true)
		console.log('Audio is playing')
	}
	// 监听暂停
	const pauseListener = () => {
		setIsPlay(false)
		console.log('Audio is paused')
	}
	// 监听结束
	const endedListener = () => {
		setIconIndex(3)
		console.log('Audio has ended')
	}

	useEffect(() => {
		const audio = audioRef.current
		console.log('lottie', lottie)
		if (!audio) return
		audio.addEventListener('play', playListener)
		audio.addEventListener('pause', pauseListener)
		audio.addEventListener('ended', endedListener)
		return () => {
			audio.removeEventListener('play', playListener)
			audio.removeEventListener('pause', pauseListener)
			audio.removeEventListener('ended', endedListener)
		}
	}, [])

	return (
		<div className={clsx('', className)} onClick={() => play()}>
			<div className="min-w-16 flex items-center justify-between">
				{!isSelf && <Icon className="" f7={icons[iconIndex]} size={22} />}
				<span className="px-2">{duration}</span>
				{isSelf && <Icon className="rotate-180" f7={icons[iconIndex]} size={22} />}
			</div>
			{content && (
				<audio
					ref={audioRef}
					className="hidden"
					src={content.isBlob ? content.url : `data:${content.mimeType};base64,${content.recordDataBase64}`}
				/>
			)}
		</div>
	)
}

export default MessageAudio
