import { memo } from 'react'
import { Flex } from 'antd'
import ChatList from '@/components/chat-list'
import { generateChatList } from '@/mock/data'
import { Capacitor } from '@capacitor/core'

const Home = memo(() => {
	// const commonStore = useCommonStore()
	// console.log('Home:')
	console.log('Capacitor', Capacitor, import.meta.env)

	return (
		<Flex align="start">
			<ChatList data={generateChatList(100)} />
			<p className="w750:flex hidden">Select align :</p>
		</Flex>
	)
})

export default Home
