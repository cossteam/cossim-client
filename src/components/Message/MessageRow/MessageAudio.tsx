import clsx from 'clsx'
import { Icon } from 'framework7-react'
import { useEffect, useMemo, useRef } from 'react'

interface MessageAudioProps {
	className?: string
	item: { [key: string]: any }
}

// {
//     "mimeType": "audio/webm;codecs=opus",
//     "msDuration": 5280,
//     "recordDataBase64": "",
//     "url": "https://coss.gezi.vip/api/v1/storage/files/download/audio/23795966-8e52-4243-a38a-2b66ea3be340.webm",
//     "isBlob": true
// }

const MessageAudio: React.FC<MessageAudioProps> = ({ className, item }) => {
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

	const play = () => {
		console.log(content)
		console.log('play', audioRef.current?.played)
		audioRef.current?.play()
	}

	const playListener = () => {
		console.log('Audio is playing')
	}

	const pauseListener = () => {
		console.log('Audio is paused')
	}

	const endedListener = () => {
		console.log('Audio has ended')
	}

	useEffect(() => {
		const audio = audioRef.current
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
			<span>{duration}</span>
			<Icon f7="radiowaves_left" size={22} />
			<audio
				ref={audioRef}
				className="hidden"
				src={content.isBlob ? content.url : `data:${content.mimeType};base64,${content.recordDataBase64}`}
			/>
		</div>
	)
}

export default MessageAudio
