import React from 'react';
import { Avatar, Card, List, Typography } from 'antd';

const { Text } = Typography;

interface UserInfoItem {
    title: string;
    content: string;
    action?: boolean;
}

interface RequestInfoCard {
    requestId: number;
    avatar?: string;
    nickname: string;
    signature?: string;
    userInfoItem?: UserInfoItem[];
    userId?: string;
    onRequestHandled?: () => void;
}

const RequestInfoCard: React.FC<RequestInfoCard> = ({ requestId, avatar, nickname, signature = '', userInfoItem = [] }) => {

    return (
        <div className="rounded-lg">
            {/* 用户卡片 */}
            <Card bordered={false} className="text-center flex flex-col h-full">
                <Avatar size={96} src={avatar} className="mb-2" />
                <Text strong className="block mb-1">{nickname}</Text>
                <Text type="secondary" className="block">{signature}</Text>
            </Card>

            <div className="h-2 bg-gray-100"></div>

            {/* 请求信息 */}
            <div className="p-4 flex flex-col items-start">
                <Text type="secondary" className="text-sm leading-tight mb-2">请求信息</Text>
                <Text className="text-sm leading-tight">测试请求信息</Text>
            </div>

            <div className="h-2 bg-gray-100"></div>

            {/* 用户信息列表 */}
            <div >
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

            {/* <div className="flex justify-between w-full ">
                <Button variant="text" size="lg" className="flex-1 mr-2 text-gray-500 hover:text-gray-500" onClick={() => handleFriendRequest(0)}>拒绝</Button>
                <Button variant="text" size="lg" className="flex-1 ml-2 text-[#26B36D] hover:text-[#26B36D]" onClick={() => handleFriendRequest(1)}>
                    接受
                </Button>
            </div> */}
        </div>
    );
};

export default RequestInfoCard;
