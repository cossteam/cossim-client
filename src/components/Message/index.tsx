import { Page } from 'framework7-react'
import './styles/Message.scss'
import { useWindowSize } from '@reactuses/core'
import MessageHeader from './MessageHeader'
import MessageContent from './MessageContent'
import MessageToolbar from './MessageToolbar'
import useKeyboard from '@/hooks/useKeyboard'
import './styles/MessageTip.scss'
import MessageForward from './MessageContent/MessageForward'
import useMessageStore from '@/stores/new_message'
import { useMemo } from 'react'
import { tooltipType } from '@/shared'

const Message: React.FC<RouterProps> = () => {
	const { height } = useWindowSize()
	const messageStore = useMessageStore()

	// 处理键盘的
	// TODO： 需优化
	useKeyboard()

	// 转发组件
	const messageForward = useMemo(() => {
		return (
			<MessageForward
				opened={messageStore.manualTipType === tooltipType.FORWARD}
				openedClose={() => messageStore.update({ manualTipType: tooltipType.NONE })}
				selectComplate={(selectList) => messageStore.update({ selectedMessages: selectList })}
			/>
		)
	}, [messageStore.manualTipType])

	return (
		<Page noToolbar className="coss_message transition-all relative">
			<div className="h-screen overflow-hidden flex flex-col" style={{ height }}>
				<MessageHeader />
				<MessageContent />
				<MessageToolbar />
			</div>

			{/* 转发弹出 */}
			{messageForward}
		</Page>
	)
}

export default Message
