import IconButton from '@/components/icon/icon-button'
import { MehOutlined, PaperClipOutlined, PlusOutlined } from '@ant-design/icons'
import { Flex, Popover } from 'antd'
import { SendIcon } from '@/components/icon/icon'
import { useState } from 'react'
import MessageEmojis from './message-emojis'
import useMobile from '@/hooks/useMobile'
import MessageInput from './message-input'

const MessageFooter = () => {
    const [open, setOpen] = useState<boolean>(false)

    const { isMobile } = useMobile()

    return (
        <Flex className="bg-background px-3 max-h-[300px] py-3" align="end">
            <IconButton className="text-2xl text-gray-500" component={PaperClipOutlined} hover={false} active={false} />

            <MessageInput />

            {isMobile ? (
                <IconButton className="text-2xl text-gray-500" component={MehOutlined} hover={false} active={false} />
            ) : (
                <Popover
                    content={<MessageEmojis />}
                    trigger="click"
                    open={open}
                    onOpenChange={(open) => setOpen(open)}
                    arrow={false}
                    rootClassName="container--filter popover--padding"
                    overlayStyle={{ padding: 0 }}
                    placement="topLeft"
                    destroyTooltipOnHide
                >
                    <a className="flex" onClick={(e) => e.preventDefault()}>
                        <IconButton
                            className="text-2xl text-gray-500"
                            component={MehOutlined}
                            hover={false}
                            active={false}
                        />
                    </a>
                </Popover>
            )}
            <IconButton className="text-2xl text-gray-500" component={PlusOutlined} hover={false} active={false} />
            <IconButton className="text-2xl text-primary" component={SendIcon} hover={false} active={false} />
            {/* <IconButton className="text-2xl text-primary" component={AudioIcon} hover={false} active={false} /> */}
        </Flex>
    )
}

export default MessageFooter
