import { useElementSize } from '@reactuses/core'
import { Flex } from 'antd'
import { memo, useEffect, useRef } from 'react'

const MessageContent = memo(() => {
	const messageContentRef = useRef<HTMLDivElement>(null)

	const [height] = useElementSize(messageContentRef)

	useEffect(() => {
		console.log('height', height)
	}, [height])

	return (
		<Flex className="flex-1" ref={messageContentRef}>
			111
		</Flex>
	)
})

export default MessageContent
