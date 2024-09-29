import { Flex, Typography, Dropdown, Divider, Avatar, Modal } from 'antd'
import { useMemo, useState } from 'react'
import useCallStore from '@/stores/call'
import { Bell, DotsThreeOutline, Fire, ImageSquare, Info, MagnifyingGlass, Phone, Trash, VideoCamera } from '@phosphor-icons/react'
import ContactCard from '@/components/contact/user-info/contact-card'

// 定义头部高度常量
export const headerHeight = 50

interface MessageHeaderProps {
    isGroup?: boolean;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ isGroup }) => {
    const callStore = useCallStore()
    const [isHovered, setIsHovered] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const mockUserInfo = {
        avatar: "https://example.com/user-avatar.png",
        coss_id: "123456",
        dialog_id: 1,
        email: "user@example.com",
        nickname: "用户昵称",
        preferences: {
            open_burn_after_reading: false,
            open_burn_after_reading_time_out: 0,
            remark: '',
            silent_notification: false
        },
        relation_status: 0,
        signature: "用户签名",
        status: 1,
        tel: "1234567890",
        user_id: "123456",
    }

    const call = (video: boolean) => {
        if (callStore.isAudio || callStore.isVideo) return
        callStore.create(`${Date.now()}`, video ? 'video' : 'audio', video, !video, false)
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const renderUser = () => (
        <Flex align="center">
            <Avatar src="https://example.com/user-avatar.png" size={30} />
            <Flex className="ml-3 flex-col">
                <Typography.Text className="text-sm">用户昵称</Typography.Text>
                <Typography.Text className="text-gray-500 text-xs">最后在线于 xxx</Typography.Text>
            </Flex>
        </Flex>
    )

    const renderGroup = () => (
        <Flex align="center">
            <Avatar src="https://example.com/user-avatar.png" size={30} />
            <Flex className="ml-3 flex-col">
                <Typography.Text className="text-sm">群组昵称</Typography.Text>
                <Typography.Text className="text-gray-500 text-xs">664 成员 1 在线</Typography.Text>
            </Flex>
        </Flex>
    )

    const DropdownRender = () => {
        const items = useMemo(
            () => [
                {
                    type: 'item',
                    title: '信息',
                    key: '0',
                    icon: <Info size={22} weight="light" className='text-gray-500' />
                },
                {
                    type: 'divider'
                },
                {
                    type: 'item',
                    title: '关闭通知',
                    key: '1',
                    icon: <Bell size={22} weight="light" className='text-gray-500' />
                },
                {
                    type: 'item',
                    title: '阅后即焚',
                    key: '3',
                    icon: <Fire size={22} weight="light" className='text-gray-500' />
                },
                {
                    type: 'item',
                    title: '更改壁纸',
                    key: '3',
                    icon: <ImageSquare size={22} weight="light" className='text-gray-500' />
                },
                {
                    type: 'divider'
                },
                {
                    type: 'item',
                    title: '删除会话',
                    key: '4',
                    icon: <Trash size={22} weight="light" className='text-gray-500' />
                },
            ],
            []
        )
    
        return (
            <Flex className="bg-background rounded-md shadow-custom" vertical onClick={(e) => { handleClick(e); }}>
                {items && items.map((item, index) => {
                    const isFirstItem = index === 0;
                    const isLastItem = index === items.length - 1;
                    return item.type === 'item' ? (
                        <Flex
                            className={`px-3 w-full hover:bg-[#F7F7F7] ${isFirstItem ? 'rounded-t-md' : ''} ${isLastItem ? 'rounded-b-md' : ''}`}
                            key={index}
                            gap={10}
                            style={{ width: '120px', height: '40px' }}
                            align="center"
                            justify="start"
                        >
                            {item?.icon}
                            <Typography.Text className="text-sm" style={{ userSelect: 'none' }}>{item.title}</Typography.Text>
                        </Flex>
                    ) : (
                        <Divider className="m-0" key={index} />
                    );
                })}
            </Flex>
        )
    }

    return (
        <>
            <Flex
                className={`h-[${headerHeight}px] bg-background pl-5 pr-3`}
                justify="center"
                vertical
                onClick={showModal}
            >
                <Flex justify="space-between">
                    <Flex vertical>
                        {isGroup ? renderGroup() : renderUser()}
                    </Flex>
                    <Flex align="center" gap={20}>
                        <MagnifyingGlass weight="light" className="text-xl text-gray-500 hover:text-gray-700 cursor-pointer" onClick={handleClick} />
                        <Phone weight="light" className="text-xl text-gray-500 hover:text-gray-700 cursor-pointer" onClick={(e) => { handleClick(e); call(true); }} />
                        <VideoCamera weight="light" className="text-xl text-gray-500 hover:text-gray-700 cursor-pointer" onClick={(e) => { handleClick(e); call(false); }} />
                        <Dropdown
                            trigger={['hover']}
                            dropdownRender={() => <DropdownRender />}
                            onOpenChange={(visible) => {
                                setIsHovered(visible)
                            }}
                        >

                            <DotsThreeOutline
                                onClick={(e) => { handleClick(e); }}
                                weight='fill'
                                className={`cursor-pointer text-xl ${isHovered ? 'text-primary' : 'text-gray-500'}`} />

                        </Dropdown>
                    </Flex>
                </Flex>
            </Flex>
            <Modal
                wrapClassName="ant-modal-content-p-0"
                className='overflow-y-auto rounded-lg'
                width={480}
                height={480}
                open={isModalVisible}
                onCancel={handleCancel}
                centered
                footer={null}
            >

                <ContactCard
                    width='480px'
                    {...mockUserInfo}
                />

            </Modal>
        </>
    )
}

export default MessageHeader
