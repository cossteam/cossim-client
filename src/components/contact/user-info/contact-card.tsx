import { GetUserInfoData, getUserInfoApi } from "@/api/user"
import UserCard from "@/components/user/user-card"
import useMobile from "@/hooks/useMobile"
import { ChatCircleDots, BellSlash, DotsThreeOutline, Phone } from "@phosphor-icons/react"
import { ConfigProvider, Divider, Dropdown, Flex, List, message, Modal, Switch, Typography } from "antd"
import React, { useEffect } from "react"
import { useState, useCallback } from "react"

const { Text } = Typography;

interface ContactCardProps {
    userId: string
}

const ContactCard: React.FC<ContactCardProps> = ({ userId }) => {
    const { height } = useMobile();

    const [userInfo, setUserInfo] = useState<GetUserInfoData | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isBlacklisted, setIsBlacklisted] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [burnAfterReadValue, setBurnAfterReadValue] = useState('关闭');

    const fetchUserInfo = useCallback(async () => {
        try {
            const response = await getUserInfoApi({ id: userId });
            if (response.code === 200) {
                setUserInfo(response.data);
            } else {
                message.error('获取用户信息失败: ' + response.msg);
            }
        } catch (error) {
            console.error('获取用户信息出错:', error);
            message.error('获取用户信息失败，请稍后重试');
        }
    }, [userId]);

    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);

    const handleBlacklistToggle = useCallback(() => {
        if (isBlacklisted) {
            setIsBlacklisted(false);
        } else {
            setIsModalVisible(true);
        }
    }, [isBlacklisted]);

    const handlePinToggle = useCallback((checked: boolean) => {
        setIsPinned(checked);
    }, []);

    const handleAction = useCallback((action: string) => {
        message.info(`${action}功能尚未实现`);
    }, []);

    const handleBlacklistConfirm = useCallback(() => {
        setIsBlacklisted(true);
        setIsModalVisible(false);
    }, []);

    const renderActionButton = useCallback((icon: React.ReactNode, text: string, onClick: () => void) => (
        <div className="flex-1 flex flex-col items-center justify-center text-[#26B36D] hover:text-[#1a8f56] cursor-pointer" onClick={onClick}>
            {icon}
            <span className="mt-1">{text}</span>
        </div>
    ), []);

    const getUserInfoItems = useCallback((user: GetUserInfoData) => [
        { title: '用户ID', content: user.coss_id, action: true },
        { title: '昵称', content: user.nickname },
        { title: '邮箱', content: user.email },
        { title: '来源', content: '未知' }
    ], []);

    const additionalItems = [
        { title: '置顶聊天', content: isPinned ? "开启" : "关闭", type: 'switch', action: handlePinToggle },
        { title: '共同的群', content: 1, type: 'text', action: () => message.info('跳转到共同的群页面') },
        {
            title: '阅后即焚', content: burnAfterReadValue, type: 'dropdown',
            options: ['关闭', '5秒', '10秒', '30秒'],
            action: (value: string) => setBurnAfterReadValue(value)
        },
        { title: '加入黑名单', content: isBlacklisted ? '是' : '否', type: 'switch', action: handleBlacklistToggle },
    ];

    const renderAdditionalInfoSlot = useCallback(() => (
        <div className="bg-white rounded-lg">
            <List
                split={false}
                size="small"
                dataSource={additionalItems}
                renderItem={(item, index) => (
                    <React.Fragment key={item.title}>
                        <List.Item className="p-2 flex items-center justify-between">
                            <List.Item.Meta
                                title={
                                    <div className="py-1 flex justify-between items-center">
                                        <Text className="text-sm leading-tight">{item.title}</Text>
                                        {item.type === 'switch' && (
                                            <ConfigProvider theme={{ token: { colorPrimary: '#26b36d' } }}>
                                                <Switch
                                                    size="small"
                                                    checked={item.title === '加入黑名单' ? isBlacklisted : item.content === '开启'}
                                                    onChange={item.action as (checked: boolean) => void}
                                                />
                                            </ConfigProvider>
                                        )}
                                        {item.type === 'text' && (
                                            <Text type="secondary" className="text-sm leading-tight">{item.content}</Text>
                                        )}
                                        {item.type === 'page' && (
                                            <Text className="text-sm leading-tight cursor-pointer text-blue-500" onClick={item.action as () => void}>{item.content}</Text>
                                        )}
                                        {item.type === 'dropdown' && (
                                            <Dropdown
                                                menu={{
                                                    items: (item.options as string[]).map(option => ({
                                                        key: option,
                                                        label: option,
                                                        onClick: () => (item.action as (value: string) => void)(option)
                                                    })),
                                                }}
                                                trigger={['click']}
                                            >
                                                <Text type="secondary" className="text-sm leading-tight cursor-pointer">{item.content}</Text>
                                            </Dropdown>
                                        )}
                                    </div>
                                }
                            />
                        </List.Item>
                        {index < additionalItems.length - 1 && (
                            <div className="px-4">
                                <Divider className="my-0" />
                            </div>
                        )}
                    </React.Fragment>
                )}
            />
        </div>
    ), [additionalItems, isBlacklisted]);

    return (
        // <Flex className="flex-1 container--background flex flex-col" vertical>
        <>
            <div className='flex-1 overflow-y-auto'>
                <div className='bg-gray-100 rounded-lg'>
                    {userInfo && (
                        <UserCard
                            userId={userId}
                            avatar={userInfo.avatar}
                            nickname={userInfo.nickname}
                            signature={userInfo.signature}
                            userInfoItem={getUserInfoItems(userInfo)}
                            actions={
                                <div className="flex justify-between w-full flex-grow">
                                    {renderActionButton(<ChatCircleDots weight="fill" className="text-2xl" />, "聊天", () => handleAction("聊天"))}
                                    {renderActionButton(<Phone weight="fill" className="text-2xl" />, "通话", () => handleAction("通话"))}
                                    {renderActionButton(<BellSlash weight="fill" className="text-2xl" />, "关闭通知", () => handleAction("关闭通知"))}
                                    {renderActionButton(<DotsThreeOutline weight="fill" className="text-2xl" />, "更多", () => handleAction("更多"))}
                                </div>
                            }
                            additionalInfoSlot={renderAdditionalInfoSlot()}
                        />
                    )}
                </div>
            </div>

            <Modal
                title={<div className="text-center pt-4">加入黑名单</div>}
                wrapClassName="ant-modal-content-p-0"
                open={isModalVisible}
                onOk={handleBlacklistConfirm}
                onCancel={() => setIsModalVisible(false)}
                width={320}
                height={190}
                closable={false}
                centered
                footer={[
                    <div key="footer" className="flex justify-between w-full">
                        <button className="flex-1 py-2 text-gray-500" onClick={() => setIsModalVisible(false)}>取消</button>
                        <button className="flex-1 py-2 text-red-500" onClick={handleBlacklistConfirm}>加入黑名单</button>
                    </div>
                ]}
            >
                <div className="flex items-center justify-center h-[40px]">
                    <Text type="secondary" className="text-xs leading-tight text-center">
                        加入黑名单后，你将不再收到对方的任何消息
                    </Text>
                </div>
            </Modal>
        </>

        // </Flex>
    )
}

export default ContactCard