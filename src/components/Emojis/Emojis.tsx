
import './Emojis.scss'
// import { useEffect, useState } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

interface EmojisProps {
	onSelectEmojis: (emojis: any) => void
}

const Emojis: React.FC<EmojisProps> = (props) => {


	return (
		<div className="emojis" onClick={(e) => e.stopPropagation()}>
			<div className="bg-[#f5f5f5]">
				<div className="w-full" onClick={(e) => e.stopPropagation()}>
					<Picker
						data={data}
						onEmojiSelect={(emojis:any)=>props.onSelectEmojis(emojis)}
						dynamicWidth={true}
						locale="zh"
						previewPosition="none"
					/>
				</div>
			</div>
		</div>
	)
}

export default Emojis
