import React, { useState } from 'react';
import { Segmented, Typography, Flex, List, Avatar, Button } from 'antd';
import useMobile from '@/hooks/useMobile';

const { Text } = Typography;

const NewRequest: React.FC = () => {
    const { height } = useMobile();
    const [currentTab, setCurrentTab] = useState<string>('所有');

    const segmentOptions = [
        { label: '所有', value: '所有' },
        { label: '未处理', value: '未处理' },
        { label: '已处理', value: '已处理' }
    ];

    // 模拟请求列表数据
    const mockRequests = [
        {
            id: 1,
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            nickname: '用户1',
            time: '14:30',
            source: '通过搜索',
        },
        {
            id: 2,
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            nickname: '用户3',
            time: '昨天',
            source: '通过群聊',
        },
        {
            id: 3,
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            nickname: '用户2',
            time: '2023-05-19 09:15',
            source: '通过群聊',
        },
    ];

    return (
        <Flex className="flex-1 container--background" style={{ height }} vertical>
            <Text className="h-[51px] flex items-center justify-center bg-white border-b">新的请求</Text>
            <div className='h-[70px] w-full bg-white flex items-center justify-center'>
                <Segmented
                    className="w-[70%] flex justify-center"
                    options={segmentOptions.map(option => ({
                        ...option,
                        className: 'flex-1 text-center rounded-[10px]'
                    }))}
                    value={currentTab}
                    onChange={(value) => setCurrentTab(value.toString())}
                />
            </div>
            <div className='flex-1 m-5 bg-white rounded-lg'>
                <List
                    itemLayout="horizontal"
                    dataSource={mockRequests}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                <Button type='text' key="reject" style={{ borderColor: '#d9d9d9', color: 'rgba(0, 0, 0, 0.65)', borderRadius: '20px' }}>拒绝</Button>,
                                
                                <Button type='text' key="accept" style={{ 
                                    borderRadius: '20px' ,
                                    backgroundColor: '#26B36D',
                                    color: '#fff'
                                }}>接受</Button>
                            ]}
                            style={{ 
                                padding: '10px 0px',
                             }}
                        >
                            <List.Item.Meta
                                avatar={<Avatar className='ml-4' src={item.avatar} size={48} />}
                                title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.nickname}</span>}
                                description={
                                    <Text type="secondary" style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>
                                        {item.time} <span style={{ margin: '0 5px', borderLeft: '1px solid rgba(0, 0, 0, 0.06)' }}></span> {item.source}
                                    </Text>
                                }
                                style={{ display: 'flex', alignItems: 'center' }}
                            />
                        </List.Item>
                    )}
                />
            </div>
        </Flex>
    );
};

export default NewRequest;
