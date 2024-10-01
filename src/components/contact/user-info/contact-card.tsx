import { GetUserInfoData } from "@/api/user"
import UserCard from "@/components/user-card"
import { ChatCircleDots, BellSlash, DotsThreeOutline, Phone, ShareNetwork, Trash, Broom, Prohibit } from "@phosphor-icons/react"
import { ConfigProvider, Divider, Dropdown, List, message, Modal, Switch, Typography, Avatar, Button } from "antd"
import React from "react"
import { useState, useCallback, useEffect } from "react"

const { Text } = Typography;

import { Contact } from '@/types/storage';
import { deleteFriendApi } from "@/api/relation"
import { useNavigate } from "react-router-dom"
import useContactStore from "@/stores/contact"

interface ContactCardProps extends Contact { 
    height?: string;
    width?: string;
}

const ContactCard: React.FC<ContactCardProps> = (props) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [burnAfterReadValue, setBurnAfterReadValue] = useState('关闭');
    const [openMore, setOpenMore] = useState(false);

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const navigate = useNavigate();

    const handleBlacklist = useCallback(() => {
        setIsModalVisible(true)
    }, [props.user_id]);

    const handlePinToggle = useCallback((checked: boolean) => {
        setIsPinned(checked);
    }, []);

    const handleAction = useCallback((action: string) => {
        message.info(`${action}功能尚未实现`);
    }, []);

    const handleBlacklistConfirm = useCallback(() => {
        // TODO 发送请求真实的添加黑名单
        useContactStore.getState().addToBlacklist(props.user_id);
        setIsModalVisible(false);
        navigate('/dashboard/contact');
        message.success('已添加到黑名单');
    }, [props.user_id]);

    const moreMenuItems = [
        {
            key: 'share',
            label: '分享联系人',
            icon: <ShareNetwork size={20} />,
            onClick: () => handleAction('分享联系人')
        },
        {
            key: 'deleteHistory',
            label: '删除历史记录',
            icon: <Broom size={20} />,
            onClick: () => handleAction('删除历史记录')
        },
        {
            key: 'delete',
            label: '删除联系人',
            icon: <Trash size={20} />,
            onClick: () => setIsDeleteModalVisible(true)
        },
        {
            key: 'blacklist',
            label: '加入黑名单',
            icon: <Prohibit size={20} />,
            onClick: () => handleBlacklist()
        }
    ];

    const handleDeleteContact = async () => {
        setIsDeleting(true);
        
        try {
            const resp = await deleteFriendApi(props.user_id);
            if (resp.code === 200) {
                useContactStore.getState().deleteContact(props.user_id);
                navigate('/dashboard/contact');
            } else {
                message.error('删除联系人失败: ' + resp.msg);
            }
        } catch (error) {
            console.error('删除联系人失败:', error);
            message.error('删除联系人失败，请稍后重试');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalVisible(false);
        }
    };

    const handleOpenMore = useCallback(() => {
        setOpenMore(!openMore);
    }, [openMore]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.more-dropdown')) {
                setOpenMore(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const getUserInfoItems = (user: GetUserInfoData) => [
        { title: '用户ID', content: user.user_id, action: true },
        { title: '昵称', content: user.nickname },
        { title: '邮箱', content: user.email },
        { title: '来源', content: '未知' }
    ];

    const additionalItems = [
        { title: '置顶聊天', content: isPinned ? "开启" : "关闭", type: 'switch', action: handlePinToggle },
        { title: '共同的群', content: 1, type: 'text', action: () => message.info('跳转到共同的群页面') },
        {
            title: '阅后即焚', content: burnAfterReadValue, type: 'dropdown',
            options: ['关闭', '5秒', '10秒', '30秒'],
            action: (value: string) => setBurnAfterReadValue(value)
        },
    ];
    
    const renderActionButton = useCallback((icon: React.ReactNode, text: string, onClick: () => void) => (
        <div className="flex-1 flex flex-col items-center justify-center text-[#26B36D] hover:text-[#1a8f56] cursor-pointer" onClick={onClick}>
            {icon}
            <span className="mt-1">{text}</span>
        </div>
    ), []);

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
                                                    checked={item.content === '开启'}
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
    ), [additionalItems]);

    return (
        <>
            <div className='flex-1 overflow-y-auto' style={{ height: props.height }}>
                <div className='bg-gray-100 rounded-lg'>
                    {props && (
                        <UserCard
                            width={props.width}
                            userId={props.user_id}
                            avatar={props.avatar}
                            nickname={props.preferences?.remark || props.nickname}
                            signature={props.signature}
                            userInfoItem={getUserInfoItems(props)}
                            actions={
                                <div className="flex justify-between w-full flex-grow">
                                    {renderActionButton(<ChatCircleDots weight="fill" className="text-2xl" />, "聊天", () => handleAction("聊天"))}
                                    {renderActionButton(<Phone weight="fill" className="text-2xl" />, "通话", () => handleAction("通话"))}
                                    {renderActionButton(<BellSlash weight="fill" className="text-2xl" />, "关闭通知", () => handleAction("关闭通知"))}
                                    <div onClick={handleOpenMore} className="flex-1 flex flex-col items-center justify-center text-[#26B36D] hover:text-[#1a8f56] cursor-pointer more-dropdown">
                                        <div className="flex flex-col items-center">
                                            <DotsThreeOutline weight="fill" className="text-2xl" />
                                        </div>
                                        <Dropdown
                                            open={openMore}
                                            menu={{ items: moreMenuItems }}
                                            trigger={['click']}
                                            placement="bottom"
                                            arrow={{ pointAtCenter: true }}
                                        >
                                            <span className="mt-1">更多</span>
                                        </Dropdown>
                                    </div>
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

            <Modal
                title={null}
                open={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                footer={null}
                width={330}
                centered
                wrapClassName="ant-modal-content-p-0"
            >
                <div className="flex flex-col items-center pt-4">
                    <Avatar size={64} src={props.avatar} className="mb-4" />
                    <Text strong className="mb-2">删除联系人</Text>
                    <Text type="secondary" className="text-center mb-4">
                        是否确认删除联系人 {props.nickname}？
                    </Text>
                    <div className="flex justify-between w-full">
                        <Button type="text" className="flex-1 mr-2" onClick={() => setIsDeleteModalVisible(false)}>取消</Button>
                        <Button type="text" className="flex-1" danger loading={isDeleting} onClick={handleDeleteContact}>
                            删除
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ContactCard