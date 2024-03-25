import { ArrowRightCircleFill } from 'framework7-icons/react'
import { Link } from 'framework7-react'
import { editMessage, sendMessage } from '../script/message'
import useMessageStore from '@/stores/new_message'
import { msgType, tooltipType } from '@/shared'

const MessageSendButton = () => {
	const messageStore = useMessageStore()

	const handlerSendMessage = () => {
		if (messageStore.manualTipType === tooltipType.EDIT) {
			// 编辑消息
			editMessage(messageStore.content)
		} else {
			sendMessage(messageStore.content, msgType.TEXT)
		}

		// 无论成功与否，清空输入框内容，交给输入组件处理
		messageStore.update({ isClearContent: true, manualTipType: tooltipType.NONE, tipType: tooltipType.NONE })
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
