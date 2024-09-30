import { Flex, Popover } from 'antd'
import { useState, useMemo } from 'react'
import MessageEmojis from './message-emojis'
import useMobile from '@/hooks/useMobile'
import MessageInput from './message-input'
import { Paperclip, PaperPlaneRight, Plus, Smiley } from '@phosphor-icons/react'
import useMessagesStore from '@/stores/messages'

const height = 50

// 消息页脚组件，包含表情、附件等功能按钮
const MessageFooter = () => {
    // 控制表情弹出框的开关状态
    const [isEmojiPopoverOpen, setIsEmojiPopoverOpen] = useState(false)
    // 判断是否为移动设备
    const { isMobile } = useMobile()
    // 获取消息草稿
    const { draft } = useMessagesStore()

    // 图标按钮的通用属性
    const iconButtonProps = {
        className: "text-2xl text-gray-500",
        hover: false,
        active: false
    }

    // 发送按钮的颜色
    const sendButtonColor = useMemo(() => {
        // 检查draft是否为空字符串或只包含空白字符（包括空的p标签）
        return draft.replace(/<p><\/p>/g, '').trim().length > 0 ? "text-primary" : "text-gray-500"
    }, [draft])

    // 渲染表情按钮
    const renderEmojiButton = () => {
        const emojiButton = (
            <Smiley size={24} {...iconButtonProps} weight="light" className="text-xl text-gray-500 hover:text-gray-700 cursor-pointer" />
        )

        // 移动设备直接返回按钮，不使用弹出框
        if (isMobile) return emojiButton

        // 非移动设备使用弹出框展示表情选择器
        return (
            <Popover
                content={<MessageEmojis />}
                trigger="click"
                open={isEmojiPopoverOpen}
                onOpenChange={setIsEmojiPopoverOpen}
                arrow={false}
                rootClassName="container--filter popover--padding"
                overlayStyle={{ padding: 0 }}
                placement="topLeft"
                destroyTooltipOnHide
            >
                <a className="flex" onClick={(e) => e.preventDefault()}>
                    {emojiButton}
                </a>
            </Popover>
        )
    }

    return (
        // 消息页脚容器
        <Flex className={`h-[${height}px] bg-background px-3 max-h-[300px]`} align="center">
            {/* 附件按钮 */}
            <Paperclip size={24} {...iconButtonProps} weight="light" className="text-gray-500 hover:text-gray-700 cursor-pointer" />

            {/* 消息输入框 */}
            <div className='w-full px-4'>
                <MessageInput />
            </div>

            <Flex align="center" gap={10}>
                {/* 表情按钮 */}
                {renderEmojiButton()}
                {/* 更多功能按钮 */}
                <Plus size={24} {...iconButtonProps} weight="light" className="text-gray-500 hover:text-gray-700 cursor-pointer" />
                {/* 发送按钮 */}
                <PaperPlaneRight size={24} {...iconButtonProps} weight={sendButtonColor === "text-primary" ? "fill" : "light"} className={`text-gray-500 hover:text-gray-700 cursor-pointer ${sendButtonColor}`} />
            </Flex>
        </Flex>
    )
}

export default MessageFooter
