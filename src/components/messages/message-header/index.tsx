import { MoreOutlined, SearchOutlined } from '@ant-design/icons'
import { Flex, Typography } from 'antd'
import { memo } from 'react'

const MessageHeader = memo(() => {
	return (
		<Flex className="min-h-[80px] bg-background pl-5 pr-3" justify="center" vertical>
			<Flex justify="space-between">
				<Flex vertical>
					<Typography.Text className="text-lg">NotionNext 交流群</Typography.Text>
					<Typography.Text className="text-gray-500 text-base">664位成员</Typography.Text>
				</Flex>
				<Flex align="center" gap={4}>
					<SearchOutlined className="text-gray-500 text-xl" />
					<MoreOutlined className="text-gray-500 text-2xl" />
				</Flex>
			</Flex>
		</Flex>
	)
})

export default MessageHeader
