// 设置页面组件
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Layout, List, Typography, Avatar, Flex, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Header, Content } from 'antd/es/layout/layout';
import { Bell, GearSix, Globe } from '@phosphor-icons/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';

const { Text } = Typography;

const Profile: React.FC = () => {
    // 状态管理
    const [activeItem, setActiveItem] = useState<number | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const userinfo = useMemo(() => useAuthStore.getState().userInfo, [])


    // 设置选项列表
    const settingOptions = useMemo(() => [
        { title: '个人信息', icon: <UserOutlined />, route: '/dashboard/profile/user-info' },
        { title: '基本设置', icon: <GearSix size={24} weight="thin" />, route: '/dashboard/profile/basic-settings' },
        { title: '通知', icon: <Bell size={24} weight="thin" />, route: '/dashboard/profile/notifications' },
        { title: '语言', icon: <Globe size={24} weight="thin" />, route: '/dashboard/profile/language' },
    ], []);

    // 处理头部点击事件
    const handleHeaderClick = useCallback(() => {
        navigate(settingOptions[0].route);
        setActiveItem(0);
    }, [navigate, settingOptions]);

    // 处理列表项点击事件
    const handleItemClick = useCallback((index: number) => {
        navigate(settingOptions[index].route);
        setActiveItem(index);
    }, [navigate, settingOptions]);

    // 根据当前路由设置活动项
    useEffect(() => {
        const currentIndex = settingOptions.findIndex(option => location.pathname === option.route);
        if (currentIndex !== -1) {
            setActiveItem(currentIndex);
        }
    }, [location, settingOptions]);

    return (
        <Layout className="h-[600px] bg-white">
            {/* 头部用户信息 */}
            <Header 
                className={`h-[80px] flex items-center justify-between px-4 bg-white transition-colors duration-300 ease-in-out ${activeItem === 0 ? 'w750:!bg-[#C9ECDA]' : ''}`}
                onClick={handleHeaderClick}
            >
                <Avatar size={64} icon={<UserOutlined />} />
                <Flex vertical justify="center" align="flex-start" className="flex-grow ml-4">
                    <Text className="text-sm leading-tight mb-2">{userinfo.email}</Text>
                    <Text className="text-sm leading-tight">{userinfo.coss_id}</Text>
                </Flex>
            </Header>

            <Divider className='m-0' />

            {/* 设置选项列表 */}
            <Content id="scrollableDiv" className="overflow-auto">
                <List
                    itemLayout="horizontal"
                    dataSource={settingOptions.slice(1)}
                    renderItem={(item, index) => (
                        <List.Item 
                            className={`rounded-md transition-colors duration-300 ease-in-out ${activeItem === index + 1 ? 'w750:!bg-[#C9ECDA]' : ''}`}
                            onClick={() => handleItemClick(index + 1)}
                        >
                            <List.Item.Meta
                                className='px-4'
                                avatar={<span className="text-lg">{item.icon}</span>}
                                title={<span className="text-sm font-normal text-gray-800">{item.title}</span>}
                            />
                        </List.Item>
                    )}
                />
            </Content>
        </Layout>
    );
};

export default Profile;
