import React from 'react'

const MessageImage: React.FC<{ item: any }> = ({ item }) => {
	const data = JSON.parse(item.content)
	const url = data.url
	console.log('接受的图片参数', data)

	return (
		<>
			<img src={url}></img>
		</>
	)
}

export default MessageImage
