
import './Emojis.scss'
// import { useEffect, useState } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import clsx from 'clsx'

interface EmojisProps {
	onSelectEmojis: (emojis: any) => void
	className?: string
}

const Emojis: React.FC<EmojisProps> = (props) => {
	return (
		<div className={clsx('emojis',props.className)} onClick={(e) => e.stopPropagation()}>
			<div className="bg-[#f5f5f5]">
				<div className="w-full text-[1rem]" onClick={(e) => e.stopPropagation()}>
					<Picker
						data={data}
						onEmojiSelect={(emojis:any)=>props.onSelectEmojis(emojis)}
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

export default Emojis
