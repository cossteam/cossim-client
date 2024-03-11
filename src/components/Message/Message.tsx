import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Page } from 'framework7-react'
import MessageHeader from './MessageHeader'
import MessageContent from './MessageContent'
import MessageFooter from './MessageFooter'
import { useChatStore } from '@/stores/chat'
import { useWindowSize } from '@reactuses/core'
import { useState } from 'react'
import './styles/Message.scss'

const Message: React.FC = () => {
	const chatStore = useChatStore()
	const { width } = useWindowSize()

	const [opacity, setOpacity] = useState<boolean>(false)

	const handleAnimationComplete = () => {
		console.log('动画过渡完成')
		!opacity && setOpacity(true)
	}

	// useEffect(() => {
	// 	if (!chatStore.opened) return
	// 	chatStore.destroy()
	// }, [chatStore.opened])

	return (
		<motion.div
			animate={{ opacity: chatStore.opened || opacity ? 1 : 0, x: chatStore.opened ? 0 : width }}
			transition={{ duration: 0.2, ease: 'easeIn' }}
			className={clsx('message-popup', { 'message-popup-opacity': opacity })}
			onAnimationComplete={handleAnimationComplete}
			// style={{ zIndex: chatStore.beforeJump ? 4999 : 5000 }}
		>
			<Page noToolbar className="coss_message transition-all relative">
				<div className="h-screen overflow-hidden flex flex-col">
					<MessageHeader />
					<MessageContent />
					<MessageFooter />
				</div>
			</Page>
		</motion.div>
	)
}

export default Message
