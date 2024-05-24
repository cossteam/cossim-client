import { memo } from 'react'
import { Flex } from 'antd'
import ChatList from '@/components/chat-list'

const Home = memo(() => {
	// const commonStore = useCommonStore()
	// console.log('Home:')

	return (
		<Flex align="start">
			<ChatList />
			<p>Select align :</p>
		</Flex>
	)
})

export default Home
