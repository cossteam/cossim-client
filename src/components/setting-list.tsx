// 设置页面
import { Layout, List, Typography, Avatar, Flex } from 'antd';
import {
    UserOutlined,
    LockOutlined,
    BellOutlined,
    SafetyOutlined,
    IdcardOutlined,
    GlobalOutlined,
    SkinOutlined,
    DatabaseOutlined,
    QuestionCircleOutlined,
    InfoCircleOutlined,
    MessageOutlined,
    SyncOutlined
} from '@ant-design/icons';
import { Header, Content } from 'antd/es/layout/layout';

const { Text } = Typography;

const SettingList = () => {
    const settingOptions = [
        { title: '基本设置', icon: <UserOutlined /> },
        { title: '隐私', icon: <LockOutlined /> },
        { title: '通知', icon: <BellOutlined /> },
        { title: '安全', icon: <SafetyOutlined /> },
        { title: '账户', icon: <IdcardOutlined /> },
        { title: '语言', icon: <GlobalOutlined /> },
        { title: '主题', icon: <SkinOutlined /> },
        { title: '存储和数据', icon: <DatabaseOutlined /> },
        { title: '帮助', icon: <QuestionCircleOutlined /> },
        { title: '关于', icon: <InfoCircleOutlined /> },
        { title: '反馈', icon: <MessageOutlined /> },
        { title: '更新', icon: <SyncOutlined /> }
    ];

    return (
        <Layout className="h-[600px] bg-white">
            <Header className="h-[100px] flex items-center justify-between px-4 bg-white">
                <Avatar size={64} icon={<UserOutlined />} />
                <Flex vertical justify="center" align="flex-start" className="flex-grow ml-4">
                    <Text className="text-sm leading-tight mb-2">user@example.com</Text>
                    <Text className="text-sm leading-tight">coss_nps2jclaa</Text>
                </Flex>
            </Header>

            <Content id="scrollableDiv" className="overflow-auto px-4">
                <List
                    itemLayout="horizontal"
                    dataSource={settingOptions}
                    renderItem={(item) => (
                        <List.Item className="cursor-pointer hover:bg-gray-100 px-2 rounded-md">
                            <List.Item.Meta
                                avatar={<span className="text-lg">{item.icon}</span>}
                                title={<span className="text-sm font-normal text-gray-800">{item.title}</span>}
                            />
                        </List.Item>
                    )}
                />
            </Content>
        </Layout>
    )
}

export default SettingList
