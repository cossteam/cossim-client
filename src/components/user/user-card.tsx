import React, { useState } from 'react';
import { Avatar, Card, Divider, List, Typography, Modal, Input, message } from 'antd';
import { UserAddOutlined, StopOutlined, CopyOutlined } from '@ant-design/icons';
import { addFriendApi } from '@/api/relation';
import { Button } from '@/components/ui/button';

const { Text } = Typography;

interface UserInfoItem {
    title: string;
    content: string;
    action?: boolean;
}

interface UserCardProps {
    avatar?: string;
    nickname: string;
    signature?: string;
    userInfoItem?: UserInfoItem[];
    groupCount?: number;
    userId: string;
}

const UserCard: React.FC<UserCardProps> = ({ avatar, nickname, signature = '', userInfoItem = [], groupCount = 0, userId }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isBlacklistModalVisible, setIsBlacklistModalVisible] = useState(false);
    const [requestMessage, setRequestMessage] = useState('');
    const [remark, setRemark] = useState('');

    const renderActionButton = (icon: React.ReactNode, text: string, onClick: () => void) => (
        <div className="flex-1 flex flex-col items-center justify-center text-green-500 hover:text-green-600 cursor-pointer" onClick={onClick}>
            {icon}
            <span className="mt-1">{text}</span>
        </div>
    );

    const handleAddContact = () => setIsModalVisible(true);
    const handleAddToBlacklist = () => setIsBlacklistModalVisible(true);
    
    const handleCancel = () => {
        setIsModalVisible(false);
        setRequestMessage('');
        setRemark('');
    };

    const handleSendRequest = async () => {
        if (!userId) {
            message.error('用户ID不存在');
            return;
        }

        try {
            const response = await addFriendApi({
                user_id: userId,
                remark: requestMessage,
            });

            if (response.code === 200) {
                message.success('好友请求发送成功');
                handleCancel();
            } else {
                message.error(response.msg || '发送请求失败');
            }
        } catch (error) {
            console.error('发送好友请求时出错:', error);
            message.error('发送请求失败，请稍后重试');
        }
    };

    const handleConfirmBlacklist = () => {
        console.log('加入黑名单');
        setIsBlacklistModalVisible(false);
    };

    const handleCancelBlacklist = () => {
        setIsBlacklistModalVisible(false);
    };

    return (
        <div className="rounded-lg">
            {/* 用户卡片 */}
            <Card bordered={false} className="text-center flex flex-col h-full ant-card-body-p-0 pt-5 pb-3" style={{ borderRadius: 0 }}>
                <Avatar size={96} src={avatar} className="mb-2" />
                <Text strong className="block mb-1">{nickname}</Text>
                <Text type="secondary" className="block mb-4">{signature}</Text>
                <div className="flex justify-between w-full flex-grow">
                    {renderActionButton(<UserAddOutlined className="text-2xl" />, "添加", handleAddContact)}
                    {renderActionButton(<StopOutlined className="text-2xl" />, "加入黑名单", handleAddToBlacklist)}
                </div>
            </Card>

            <div className="h-2 bg-gray-100"></div>

            {/* 用户信息列表 */}
            <div className="mt-2 bg-white">
                <List
                    split={false}
                    size="small"
                    dataSource={userInfoItem}
                    renderItem={(item) => (
                        item.content ? (
                            <List.Item key={item.title} className="p-2 flex items-center justify-between">
                                <List.Item.Meta
                                    title={
                                        <div className="flex items-center justify-between">
                                            <Text type="secondary" className="text-sm leading-tight">{item.title}</Text>
                                            {item.action && (
                                                <Text
                                                    copyable={{
                                                        icon: [<CopyOutlined className="text-gray-500 hover:text-primary" key="copy-icon" />]
                                                    }}
                                                />
                                            )}
                                        </div>
                                    }
                                    description={<Text className="text-sm leading-tight">{item.content}</Text>}
                                />
                            </List.Item>
                        ) : null
                    )}
                />
            </div>

            <div className="h-2 bg-gray-100"></div>

            {/* 其他信息 */}
            <div className="mt-2 bg-white">
                <div className="p-4 flex justify-between">
                    <Text className="text-sm leading-tight">共同的群</Text>
                    <Text className="text-sm leading-tight text-gray-500">{groupCount}</Text>
                </div>
                <Divider className="m-0" />
            </div>
            
            <div className="h-2 bg-gray-100"></div>

            {/* 添加联系人对话框 */}
            <Modal
                className="bg-gray-100 rounded-xl"
                title={<div className="text-center">添加联系人</div>}
                open={isModalVisible}
                onCancel={handleCancel}
                centered
                width={330}
                wrapClassName="ant-modal-content-pt0"
                footer={[
                    <div key="footer" className="flex justify-between w-full">
                        <Button 
                            variant='text'
                            className="flex-1 pb-3 text-green-500" 
                            onClick={handleSendRequest}
                        >
                            发送请求
                        </Button>
                    </div>
                ]}
            >
                <div className="bg-gray-100">
                    <div className="h-1 mt-2 bg-white"></div>
                    <div className="mt-2 bg-white px-5">
                        <div className="pt-2">
                            <Text className="block mb-1">请求信息</Text>
                            <Input
                                className='px-0'
                                placeholder="请输入你的请求消息（可选）"
                                variant="borderless"
                                maxLength={70}
                                showCount
                                value={requestMessage}
                                onChange={(e) => setRequestMessage(e.target.value)}
                            />
                        </div>
                        <div className="mb-2">
                            <Text className="block mb-1">备注</Text>
                            <Input
                                className='px-0'
                                placeholder="请输入备注（可选）"
                                variant="borderless"
                                maxLength={30}
                                showCount
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="h-1 mt-2 bg-white"></div>
                </div>
            </Modal>

            {/* 加入黑名单对话框 */}
            <Modal
                className="bg-gray-100 rounded-xl"
                title={<div className="text-center">加入黑名单</div>}
                open={isBlacklistModalVisible}
                onCancel={handleCancelBlacklist}
                centered
                closable={false}
                width={330}
                wrapClassName="ant-modal-content-pt0"
                footer={[
                    <div key="footer" className="flex justify-between w-full">
                        <button className="flex-1 py-2 text-gray-500" onClick={handleCancelBlacklist}>取消</button>
                        <button className="flex-1 py-2 text-red-500" onClick={handleConfirmBlacklist}>加入黑名单</button>
                    </div>
                ]}
            >
                <div className="px-4 pb-4 text-center">
                    <Text type="secondary">这个操作将丢失当前联系人历史消息</Text>
                </div>
                <Divider className='p-0 m-0'></Divider>
            </Modal>
        </div>
    );
};

export default UserCard;
