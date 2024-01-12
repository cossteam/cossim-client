import React, { useState } from 'react'
import { f7, MessagebarSheetImage, Icon } from 'framework7-react'
import { emojis, emojisImg } from './emojis.js'
import PropType from 'prop-types'

export default function Emojis() {
	IconComponent.propTypes = {
		fill: PropType.bool
	}
	const IconComponent = (props) => (
		<span onClick={() => setShowImgEmojis(!showImgEmojis)}>
			<Icon f7={props.fill ? 'smiley_fill' : 'smiley'} color="primary" />
		</span>
	)

	const [showImgEmojis, setShowImgEmojis] = useState(false)
	const [attachments, setAttachments] = useState([])
	const handleAttachment = (e) => {
		const index = f7.$(e.target).parents('label.checkbox').index()
		const image = emojisImg[index]
		if (e.target.checked) {
			// Add to attachments
			attachments.unshift(image)
		} else {
			// Remove from attachments
			attachments.splice(attachments.indexOf(image), 1)
		}
		setAttachments([...attachments])
	}

	return (
		<div>
			<div className="m-1 p-1" onClick={(e) => e.stopPropagation()}>
				{showImgEmojis ? <IconComponent /> : <IconComponent fill />}
			</div>
			{!showImgEmojis ? (
				// emojis
				<div className="pl-3.5">
					{emojis.map((emoji, eKey) => (
						<span key={eKey} className="m-1 p-1 text-2xl">
							{emoji}
						</span>
					))}
				</div>
			) : (
				// 图片表情
				<div className="p-1">
					{emojisImg.map((image, index) => (
						<MessagebarSheetImage
							key={index}
							image={image}
							checked={attachments.indexOf(image) >= 0}
							onChange={handleAttachment}
						/>
					))}
				</div>
			)}
		</div>
	)
}
