import { Flex } from 'antd'
import MessageHeader from './message-header'
import MessageContent from './message-content'
import MessageFooter from './message-footer'
import useMobile from '@/hooks/useMobile'

const Messages = () => {
    const { height } = useMobile()

    return (
        <Flex
            className="container--background bg-background3  flex-1 h-screen"
            style={{ height }}
            vertical
            align="stretch"
        >
            <MessageHeader />
            <MessageContent />
            <MessageFooter />
        </Flex>
    )
}

export default Messages
