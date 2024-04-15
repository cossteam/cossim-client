import clsx from 'clsx'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import '../styles/MessageEmojis.scss'

interface MessageEmojisProps {
	onSelectEmojis: (emojis: any) => void
	className?: string
}

const MessageEmojis: React.FC<MessageEmojisProps> = ({...props}) => {
	return (
		<div className={clsx('w-full emojis')} {...props} onClick={(e) => e.stopPropagation()}>
			<div className="bg-[#f5f5f5] w-full">
				<div className="w-full text-[1rem]" onClick={(e) => e.stopPropagation()}>
					<Picker
						data={data}
						onEmojiSelect={(emojis: any) => props.onSelectEmojis(emojis)}
						dynamicWidth={true}
						locale="zh"
						previewPosition="none"
						searchPosition="none"
						emojiSize="30"
						emojiButtonSize="48"
						theme="light"
					/>
				</div>
			</div>
		</div>
	)
}

export default MessageEmojis
