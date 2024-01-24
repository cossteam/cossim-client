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
		<div className="emojis bg-gray-100" onClick={(e) => e.stopPropagation()}>
			<SwitchIcon fill={showImgEmojis} onClick={() => setShowImgEmojis(!showImgEmojis)} />
			{!showImgEmojis ? (
				// emojis
				<div className="w-screen p-1 grid grid-cols-10 gap-1" onClick={(e) => e.stopPropagation()}>
					{emojis.map((emoji, eKey) => (
						<span key={eKey} className="text-2xl" onClick={() => onClickEmoji('emoji', emoji)}>
							{emoji}
						</span>
					))}
				</div>
			) : (
				// 图片表情
				<div className="img-list-wrap w-screen p-1">
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
	)
}
