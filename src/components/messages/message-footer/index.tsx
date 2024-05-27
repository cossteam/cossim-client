import { Flex } from 'antd'
import { memo } from 'react'

const MessageFooter = memo(() => {
	return (
		<Flex className="min-h-24 bg-background px-3" align="center">
			<div>Footer</div>
		</Flex>
	)
})

export default MessageFooter
