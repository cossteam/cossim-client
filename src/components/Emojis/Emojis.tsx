
import './Emojis.scss'
// import { useEffect, useState } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const Emojis = () => {
	// const [showImgEmojis, setShowImgEmojis] = useState(false)
	// const [width, setWidth] = useState<number>(375)

	// // const onClickEmoji = (type, emoji) => {
	// // 	onEmojiSelect({
	// // 		type,
	// // 		emoji
	// // 	})
	// // }

	// useEffect(() => {
	// 	const width = window.innerWidth
	// 	setWidth(width)
	// }, [])

	return (
		<div className="emojis" onClick={(e) => e.stopPropagation()}>
			<div className="bg-[#f5f5f5]">
				<div className="w-full" onClick={(e) => e.stopPropagation()}>
					<Picker
						data={data}
						onEmojiSelect={console.log}
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
