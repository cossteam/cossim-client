import React, { useCallback } from 'react';
import { Avatar, Card, List, message, Typography } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

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
    userId: string;
    actions?: React.ReactNode;
    userInfoSlot?: React.ReactNode;
    additionalInfoSlot?: React.ReactNode;
    userInfoItem?: UserInfoItem[];
}

const UserCard: React.FC<UserCardProps> = ({
    avatar,
    nickname,
    signature = '',
    userId,
    actions: actionSlot,
    userInfoItem,
    additionalInfoSlot
}) => {

    const handleCopyContent = useCallback((content: string) => {
        navigator.clipboard.writeText(content)
            .then(() => message.success('内容已复制到剪贴板'))
            .catch(() => message.error('复制失败，请手动复制'));
    }, []);

    return (
        <div className="flex flex-col space-y-2 rounded-lg">
            {/* 用户卡片 */}
            <Card bordered={false} className="text-center flex flex-col h-full ant-card-body-p-0 pt-5 pb-3">
                <Avatar size={96} src={avatar} className="mb-2" />
                <Text strong className="block mb-1">{nickname}</Text>
                <div className="h-6 mb-4">
                    <Text type="secondary" className="block">{signature}</Text>
                </div>
                {actionSlot && (
                    <div className="flex justify-between w-full flex-grow rounded-lg">
                        {actionSlot}
                    </div>
                )}
            </Card>

            {/* 用户信息列表 */}
            <div className="bg-white rounded-lg overflow-hidden">
                <div className="overflow-y-auto" style={{ maxHeight: '300px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style >{`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    <List
                        split={false}
                        size="small"
                        dataSource={userInfoItem}
                        renderItem={(item) => (
                            item.content ? (
                                <List.Item key={item.title} className="p-2 flex items-center justify-between"
                                    onClick={() => handleCopyContent(item.content ?? '')}
                                >
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
            </div>

  
            <div className="bg-white rounded-lg">
                {additionalInfoSlot}
            </div>
        </div>
    );
};

export default UserCard;
