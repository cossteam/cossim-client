import IconButton from '@/components/icon/icon-button'
import { MehOutlined, PaperClipOutlined, PlusOutlined } from '@ant-design/icons'
import { Flex } from 'antd'
import { SendIcon } from '@/components/icon/icon'

const MessageFooter = () => {
	return (
		<Flex className="min-h-16 bg-background px-3" align="center">
			<IconButton className="text-2xl text-gray-500" component={PaperClipOutlined} hover={false} active={false} />
			<input
				type="text"
				placeholder="Type a message"
				className="w-full h-10 px-3 rounded-lg bg-gray-100 focus:outline-none"
			/>
			<IconButton className="text-2xl text-gray-500" component={MehOutlined} hover={false} active={false} />
			<IconButton className="text-2xl text-gray-500" component={PlusOutlined} hover={false} active={false} />
			<IconButton className="text-2xl text-primary" component={SendIcon} hover={false} active={false} />
			{/* <IconButton className="text-2xl text-primary" component={AudioIcon} hover={false} active={false} /> */}
		</Flex>
	)
}

export default MessageFooter
