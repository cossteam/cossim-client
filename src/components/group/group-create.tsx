import React, { useEffect, useState } from "react";
import { Avatar, Card, Divider, Input, Typography, Dropdown, Modal, Tabs, message, Segmented, TabsProps, List, Checkbox, Button, ConfigProvider } from "antd";
import { PlusCircleOutlined, SearchOutlined, ArrowLeftOutlined, CameraOutlined, CheckOutlined } from "@ant-design/icons";
import ThemeButton from "../common/theme-button";
import VirtualList from 'rc-virtual-list';

const { Text } = Typography;
const { TabPane } = Tabs;

const GroupCreate: React.FC = () => {
    // 群组基本信息状态
    const [groupName, setGroupName] = useState<string>("");
    const [groupType, setGroupType] = useState<string>("公开");
    const [chatHistoryLimit, setChatHistoryLimit] = useState<string>("无");
    const [messageSaveTime, setMessageSaveTime] = useState<string>("永远");
    const [autoDissolve, setAutoDissolve] = useState<string>("永不");
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    // 渲染下拉菜单选项
    const renderDropdown = (
        title: string,
        value: string,
        options: string[],
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => (
        <>
            <div className="p-4 flex justify-between items-center">
                <Text className="text-sm leading-tight">{title}</Text>
                <Dropdown
                    menu={{
                        items: options.map(option => ({ key: option, label: option })),
                        onClick: ({ key }) => setter(key),
                    }}
                    arrow
                    placement="topRight"
                    trigger={['click']}
                >
                    <Text className="text-sm leading-tight text-gray-500 cursor-pointer">
                        {value}
                    </Text>
                </Dropdown>
            </div>
            <Divider className="m-0" />
        </>
    );

    const handleAddMember = () => {
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    type Align = '近期访问' | '联系人' | '管理的群';
    const [alignValue, setAlignValue] = useState<Align>('近期访问');
    const segmentedOptions = [
        { label: '近期访问', value: '近期访问', className: 'flex-1 text-center rounded-[10px]' },
        { label: '联系人', value: '联系人', className: 'flex-1 text-center rounded-[10px]' },
        { label: '管理的群', value: '管理的群', className: 'flex-1 text-center rounded-[10px]' }
    ];

    const testUsers = [
        { id: 1, name: '张三', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', lastOnline: '2小时前' },
        { id: 2, name: '李四', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', lastOnline: '5分钟前' },
        { id: 3, name: '王五', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', lastOnline: '刚刚' },
        { id: 4, name: '赵六', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', lastOnline: '1天前' },
        { id: 5, name: '钱七', avatar: 'https://randomuser.me/api/portraits/men/5.jpg', lastOnline: '3小时前' },
    ];

    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const handleUserSelect = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    interface UserItem {
        id: number,
        lastOnline: string,
        email: string;
        gender: string;
        name: {
            first: string;
            last: string;
            title: string;
        };
        nat: string;
        picture: {
            large: string;
            medium: string;
            thumbnail: string;
        };
    }
    const [data, setData] = useState<UserItem[]>([]);
    const fakeDataUrl =
        'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
    const ContainerHeight = 400;
    const appendData = () => {
        fetch(fakeDataUrl)
            .then((res) => res.json())
            .then((body) => {
                setData(data.concat(body.results));
                message.success(`${body.results.length} more items loaded!`);
            });
    };

    useEffect(() => {
        appendData();
    }, []);

    const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
        // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
        if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - ContainerHeight) <= 1) {
            appendData();
        }
    };

    const renderMemberModal = () => (
        <Modal
            title={
                <div className="flex items-center">
                    <ArrowLeftOutlined className="mr-2 cursor-pointer" onClick={handleModalClose} />
                    <span className="flex-grow text-center">添加成员</span>
                </div>
            }
            open={isModalVisible}
            onCancel={handleModalClose}
            footer={
                <>
                    <Divider className="m-0 pt-2"></Divider>
                    <div className="flex items-center justify-end">
                        <Text type="secondary" className="mr-2">{selectedUsers.length} 已选择</Text>
                        <ThemeButton shape="round" disabled={selectedUsers.length === 0}>
                            下一步
                        </ThemeButton>
                    </div>
                </>
            }
            width={600}
        >
            <Input
                className="rounded-xl"
                variant="filled"
                placeholder="搜索用户"
                prefix={<SearchOutlined />}
            />
            <div className="mt-2 mb-2">
                {/* 
                TODO Segmented添加rounded-xl
                options每个元素需要添加 border-radius: 10px
                */}
                <Segmented
                    className="w-full overflow-hidden mx-auto flex justify-center "
                    value={alignValue}
                    onChange={(value) => setAlignValue(value as Align)}
                    options={segmentedOptions}
                />
            </div>
            <List>
                <VirtualList
                    data={data}
                    height={ContainerHeight}
                    itemHeight={47}
                    itemKey="email"
                    onScroll={onScroll}
                >
                    {(item: UserItem) => (
                        <List.Item key={item.email} onClick={() => handleUserSelect(item.email)} className="cursor-pointer">
                            <List.Item.Meta
                                avatar={
                                    <div className="flex items-center">
                                        <div className={`w-5 h-5 border rounded-full flex items-center justify-center ${selectedUsers.includes(item.email) ? 'bg-primary border-primary' : ''}`}>
                                            {selectedUsers.includes(item.email) && <CheckOutlined className="text-white" />}
                                        </div>
                                        <Avatar className="ml-3" size="large" src={item.picture.large} />
                                    </div>
                                }
                                // avatar={<Avatar src={item.picture.large} />}
                                title={<a href="https://ant.design">{item.name.last}</a>}
                                description={`最后在线：${item.lastOnline}`}
                            />
                        </List.Item>
                    )}
                </VirtualList>
            </List>

            {/* <List
                itemLayout="horizontal"
                dataSource={testUsers}
                renderItem={user => (
                    <List.Item onClick={() => handleUserSelect(user.id)} className="cursor-pointer">
                        <List.Item.Meta
                            avatar={
                                <div className="flex items-center">
                                    <div className={`w-5 h-5 border rounded-full flex items-center justify-center ${selectedUsers.includes(user.id) ? 'bg-primary border-primary' : ''}`}>
                                        {selectedUsers.includes(user.id) && <CheckOutlined className="text-white" />}
                                    </div>
                                    <Avatar className="ml-3" size="large" src={user.avatar} />
                                </div>
                            }
                            title={user.name}
                            description={`最后在线：${user.lastOnline}`}
                        />
                    </List.Item>
                )}
            /> */}
        </Modal>
    );

    const handleUploadAvatar = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setAvatarUrl(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                message.error('请选择一个有效的图片文件');
            }
        };
        input.click();
    };

    return (
        <div className="group-create bg-gray-100">
            {/* 群组基本信息卡片 */}
            <Card bordered={false} className="text-center flex flex-col h-full ant-card-body-p-0 pt-5 pb-3" style={{ borderRadius: 0 }}>
                <Avatar
                    src={avatarUrl}
                    size={96}
                    className="mb-2 cursor-pointer hover:opacity-80"
                    icon={<CameraOutlined />}
                    onClick={handleUploadAvatar}
                />
                <Input
                    placeholder="请输入群组名称"
                    variant="borderless"
                    maxLength={30}
                    showCount
                    className="text-center"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    inputMode="text"
                />
                <Divider className="m-0" />
                <Text type="secondary" className="block pt-3">描述信息或其他提示信息</Text>
            </Card>

            {/* 群组类型设置 */}
            <div className="mt-2 bg-white">
                {renderDropdown("群类型", groupType, ["公开", "私有", "临时", "话题"], setGroupType)}
            </div>

            {/* 群组高级设置 */}
            <div className="mt-2 bg-white">
                {renderDropdown("聊天记录限制", chatHistoryLimit, ["无", "1天", "7天", "30天"], setChatHistoryLimit)}
                {renderDropdown("保存消息", messageSaveTime, ["永远", "1个月", "3个月", "6个月"], setMessageSaveTime)}
                {renderDropdown("自动解散", autoDissolve, ["永不", "1个月", "3个月", "6个月"], setAutoDissolve)}
            </div>

            {/* 成员管理区域 */}
            <div className="mt-2 bg-white">
                <div className="p-4 flex justify-between items-center">
                    <Text className="text-sm leading-tight text-gray-500">
                        成员
                        <Text className="text-sm leading-tight text-gray-500">(1/256)</Text>
                    </Text>
                    <div
                        className="flex items-center text-gray-500 text-primary hover:text-primary cursor-pointer"
                        onClick={handleAddMember}
                    >
                        <PlusCircleOutlined className="mr-2" />
                        <span>添加成员</span>
                    </div>
                </div>
                <Divider className="m-0" />
            </div>

            <div className="flex justify-between w-full bg-white mt-2 pt-4">
                <button
                    className="flex-1 text-green-500"
                >
                    完成
                </button>
            </div>

            {renderMemberModal()}
        </div>
    );
};

export default GroupCreate;
