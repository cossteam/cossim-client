import React, { useState } from 'react'
import './Emojis.less'
import SwitchIcon from './SwitchIcon.jsx'
import { emojis, emojisImg } from './emojis.js'
import PropType from 'prop-types'

Emojis.propTypes = {
	onEmojiSelect: PropType.func
}
export default function Emojis({ onEmojiSelect }) {
	const [showImgEmojis, setShowImgEmojis] = useState(false)

	const onClickEmoji = (type, emoji) => {
		onEmojiSelect({
			type,
			emoji
		})
	}

	return (
		<div className="emojis" onClick={(e) => e.stopPropagation()}>
			<div className="w-full sticky top-0 bg-white z-10 h-10">
				<SwitchIcon fill={showImgEmojis} onClick={() => setShowImgEmojis(!showImgEmojis)} />
			</div>
			<div className="bg-[#f5f5f5]">
				{!showImgEmojis ? (
					// emojis
					<div className="w-full p-3 py-1 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
						{emojis.map((emoji, eKey) => (
							<span key={eKey} className="text-2xl" onClick={() => onClickEmoji('emoji', emoji)}>
								{emoji}
							</span>
						))}
					</div>
				) : (
					// 图片表情
					<div className="img-list-wrap w-screen p-1 cursor-pointer">
						{emojisImg.map((emojiImg, index) => (
							<div key={index} className="img-item-wrap">
								<div className="img-item">
									<img
										src={emojiImg}
										alt={`emoji_${index}`}
										onClick={() => onClickEmoji('img', emojiImg)}
									/>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
