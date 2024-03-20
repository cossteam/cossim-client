import clsx from "clsx"

interface MessageAudioProps {
	className?: string
	item: any
}

const MessageAudio: React.FC<MessageAudioProps> = ({ className }) => {
	return (
        <div className={clsx('',className)}>语音</div>
    )
}

export default MessageAudio
