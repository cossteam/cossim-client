import { ArrowRightCircleFill } from 'framework7-icons/react'
import { Link } from 'framework7-react'
import { sendMessage } from '../script/message'
import useMessageStore from '@/stores/new_message'
import { msgType } from '@/shared'

const MessageSendButton = () => {
	const messageStore = useMessageStore()

	const handlerSendMessage = () => {
		// console.log('发大水')
		sendMessage(messageStore.content, msgType.TEXT)
		// 无论成功与否，清空输入框内容，交给输入组件处理
		messageStore.update({ isClearContent: true })
	}

	return (
		<Link>
			<ArrowRightCircleFill
				className="toolbar-btn animate__animated animate__zoomIn"
				onClick={handlerSendMessage}
			/>
		</Link>
	)
}

export default MessageSendButton
