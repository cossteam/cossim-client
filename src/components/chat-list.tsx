import { generateChatList } from '@/mock/data'

const ChatList = () => {
	return (
		<div className="min-w-[300px]">
			{generateChatList().map((chat) => (
				<div key={chat.id} className="flex items-center p-4 space-x-4">
					{chat.dialog_name}
				</div>
			))}
		</div>
	)
}

export default ChatList
