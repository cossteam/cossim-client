import { MoreOutlined, SearchOutlined } from '@ant-design/icons'
import { Flex, Typography, Dropdown, MenuProps } from 'antd'
import { memo, useMemo } from 'react'
import IconButton from '@/components/icon/icon-button'

const MessageHeader = memo(() => {
	const items = useMemo<MenuProps['items']>(
		() => [
			{
				label: '1nd menu item',
				key: '0'
			},
			{
				label: '2nd menu item',
				key: '1'
			},
			{
				type: 'divider'
			},
			{
				label: '3rd menu item',
				key: '3'
			}
		],
		[]
	)

	return (
		<Flex className="mobile:min-h-20 min-h-16 bg-background pl-5 pr-3" justify="center" vertical>
			<Flex justify="space-between">
				<Flex vertical>
					<Typography.Text className="text-lg">NotionNext 交流群</Typography.Text>
					<Typography.Text className="text-gray-500 text-base">664位成员</Typography.Text>
				</Flex>
				<Flex align="center" gap={10}>
					<IconButton className="text-xl text-gray-500" component={SearchOutlined} />
					<Dropdown menu={{ items }} trigger={['click']}>
						<a onClick={(e) => e.preventDefault()}>
							<IconButton className="text-xl text-gray-500" component={MoreOutlined} />
						</a>
					</Dropdown>
				</Flex>
			</Flex>
		</Flex>
	)
})

export default MessageHeader
