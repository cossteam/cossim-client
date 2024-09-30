import { Flex } from 'antd'
import QuillEditEditor from '@/components/quill-editor/quill-edit-editor'
import { $t } from '@/i18n'
import useMessagesStore from '@/stores/messages'

interface MessageInputProps {}

export const MessageInput: React.FC<MessageInputProps> = () => {
    const messageStore = useMessagesStore()

    const handleTextChange = (content: string) => {
        messageStore.update({ draft: content })
    }

    return (
        <Flex className="p-2 flex-1 bg-gray-100 rounded-lg" align="center">
            {/* <QuillEditEditor placeholder={$t('输入消息...')} textChange={handleTextChange} /> */}
            <QuillEditEditor placeholder='输入消息...' textChange={handleTextChange} />
        </Flex>
    )
}

export default MessageInput
