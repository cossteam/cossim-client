import QuillReadEditor from '@/components/quill-editor/quill-read-editor'
import MessageProvider from './message-provider'

interface MessageTextProps {
    message: Message
    isMe: boolean
}

const MessageText: React.FC<MessageTextProps> = ({ message, isMe }) => {
    return (
        <MessageProvider isMe={isMe}>
            <QuillReadEditor content={message.content} />
        </MessageProvider>
    )
}

export default MessageText
