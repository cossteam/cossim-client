import Header from '@/components/Layout/Header/Header'
import MessageContent from '@/components/Message/MessageContent'
import MessageToolbar from '@/components/Message/MessageToolbar'
import { useWindowSize } from '@reactuses/core'

const Message = () => {
	const { height } = useWindowSize()
	return (
		<div className="h-screen w-full flex flex-col bg-black relative" style={{ height }}>
			<Header title="好友" subtitle="[在线]" />
			<MessageContent />
			<MessageToolbar />
		</div>
	)
}

export default Message
