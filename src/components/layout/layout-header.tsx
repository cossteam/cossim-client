import { $t } from '@/i18n'
import { SearchOutlined, ScanOutlined, PlusOutlined, UserAddOutlined, UsergroupAddOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import { Divider, Flex, Typography, Modal, Dropdown, message } from 'antd'
import type { MenuProps } from 'antd';
import { useMemo, useState } from 'react';
import AddContact from '../add-contact';
import ContactList from '../contact-list';
import GroupCreate from '../group/group-create';

// 定义头部高度常量
export const headerHeight = 64

interface MenuItem {
    key: string;
    component: JSX.Element;
    title: string;
    label: string;
    icon: JSX.Element;
    danger?: boolean;
    disabled?: boolean;
}

const LayoutHeader = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeComponent, setActiveComponent] = useState<JSX.Element | null>(null);
    const [modalTitle, setModalTitle] = useState('');

    // 使用 useMemo 优化菜单项，避免不必要的重渲染
    const menuItems: MenuItem[] = useMemo(() => [
        {
            key: '1',
            label: '添加联系人',
            icon: <UserAddOutlined style={{ fontSize: '20px' }} />,
            component: <AddContact onClick={(item: any) => console.log('添加联系人', item)} />,
            title: '添加联系人'
        },
        {
            key: '2',
            label: '新建群组',
            icon: <UsergroupAddOutlined style={{ fontSize: '20px' }} />,
            component: <GroupCreate />,
            title: '新建群组'
        },
        {
            key: '3',
            label: '新建通话',
            icon: <VideoCameraAddOutlined style={{ fontSize: '20px' }} />,
            component: <GroupCreate />,
            title: '新建通话',
            danger: true,
            disabled: true
        },
        {
            key: '4',
            label: '扫一扫',
            icon: <ScanOutlined style={{ fontSize: '20px' }} />,
            component: <ContactList />,
            title: '扫一扫'
        },
    ], []);

    // 处理菜单点击事件
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        message.info('点击了菜单项。');
        const selectedMenu = menuItems.find(menu => menu.key === e.key);
        if (selectedMenu) {
            setActiveComponent(selectedMenu.component);
            setModalTitle(selectedMenu.title);
            setIsModalVisible(true);
        }
    };

    // 处理模态框关闭事件
    const handleModalClose = () => {
        setIsModalVisible(false);
        setActiveComponent(null);
    };

    return (
        <>
            {/* 头部布局 */}
            <Flex className="sticky top-0 z-10 bg-background pl-3" style={{ height: headerHeight }} align="center">
                {/* 搜索框 */}
                <Flex className="flex-1 bg-background2 h-8 rounded-lg px-5 cursor-pointer" align="center">
                    <div className="m-auto">
                        <SearchOutlined className="text-gray-500 text-base" />
                        <Typography.Text className="text-gray-500 text-sm ">{$t('搜索')}</Typography.Text>
                    </div>
                </Flex>

                {/* 下拉菜单 */}
                <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={['click']} placement="bottomRight" arrow={{ pointAtCenter: true }} className="text-gray-500 px-3">
                    <PlusOutlined className='' style={{ fontSize: '20px' }} />
                </Dropdown>
            </Flex>
            <Divider className="m-0" />
            {/* 模态框 */}
            <Modal
                wrapClassName="ant-modal-content-prl0"
                title={<div className="text-center">{modalTitle}</div>}
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={400}
            >
                {activeComponent}
            </Modal>
        </>
    )
}

export default LayoutHeader
