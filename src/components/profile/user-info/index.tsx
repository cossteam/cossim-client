import useMobile from "@/hooks/useMobile";
import { useAuthStore } from "@/stores/auth";
import { QrcodeOutlined, CameraOutlined } from "@ant-design/icons";
import { DotsThree, ArrowLineDown, ShareFat } from "@phosphor-icons/react";
import { Avatar, Flex, List, Typography, Upload, message, Modal, Input, Space, Dropdown } from "antd";
import { useState, useCallback } from "react";
import { createFingerprint } from '@/utils/fingerprint'
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

// 用户信息接口
interface UserInfoProps {
  avatarUrl: string;
  userId: string;
  email: string;
  nickname?: string;
  bio?: string;
}

// 用户信息组件
const UserInfo: React.FC<UserInfoProps> = ({ avatarUrl: initialAvatarUrl, nickname: initialNickname, userId, email, bio }) => {
    const { height } = useMobile();
    const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [isQRCodeModalVisible, setIsQRCodeModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState(initialNickname);
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

    const navigate = useNavigate()

    // 用户信息列表数据
    const userInfoItems = [
        { title: '用户ID', content: userId, action: true },
        { title: '邮箱', content: email },
        { title: '个人简介', content: bio },
    ];

    // 处理头像更改
    const handleAvatarChange = useCallback((info: any) => {
        if (info.file.status === 'done') {
            setAvatarUrl(info.file.response.url);
        }
    }, []);

    // 处理内容复制
    const handleCopyContent = useCallback((content: string) => {
        navigator.clipboard.writeText(content)
            .then(() => message.success('内容已复制到剪贴板'))
            .catch(() => message.error('复制失败，请手动复制'));
    }, []);

    // 处理密码更改相关函数
    const handleChangePassword = useCallback(() => setIsPasswordModalVisible(true), []);
    const handlePasswordModalOk = useCallback(() => {
        // TODO: 实现密码更改逻辑
        message.success('密码已更改');
        setIsPasswordModalVisible(false);
        setNewPassword("");
    }, []);
    const handlePasswordModalCancel = useCallback(() => {
        setIsPasswordModalVisible(false);
        setNewPassword("");
    }, []);

    // 处理二维码相关函数
    const handleQRCodeClick = useCallback(() => setIsQRCodeModalVisible(true), []);
    const handleQRCodeModalClose = useCallback(() => setIsQRCodeModalVisible(false), []);
    const handleSaveQRCode = useCallback(() => message.success('二维码已保存'), []);
    const handleSendQRCode = useCallback(() => message.success('二维码已发送至聊天'), []);

    // 二维码下拉菜单项
    const qrCodeMenuItems = [
        {
            key: '1',
            label: '另存为图片',
            icon: <ArrowLineDown size={20} weight="thin" />,
            onClick: handleSaveQRCode,
        },
        {
            key: '2',
            label: '发送至聊天',
            icon: <ShareFat size={20} weight="thin" />,
            onClick: handleSendQRCode,
        },
    ];

    // 处理编辑状态切换
    const toggleEditing = useCallback(() => setIsEditing(prev => !prev), []);

    // 处理登出相关函数
    const handleLogoutClick = useCallback(() => setIsLogoutModalVisible(true), []);
    const handleLogoutConfirm = useCallback(async () => {
        try {
            const data = await useAuthStore.getState().logout(createFingerprint())
            // console.log($t('退出登录'), data)
            console.log('退出登录', data)
        } catch (error) {
            console.log(error)
        } finally {
            navigate('/sign-in', {
                replace: true
            })
        }
        setIsLogoutModalVisible(false);
    }, []);
    const handleLogoutCancel = useCallback(() => setIsLogoutModalVisible(false), []);

    return (
        <Flex className="flex-1 container--background" style={{ height }} vertical>
            {/* 顶部标题栏 */}
            <div className="h-16 flex items-center justify-between bg-white border-b px-4">
                <Text className="flex-1 text-center">用户信息</Text>
                <button className="px-4 text-green-500 hover:text-green-600 cursor-pointer text-sm" onClick={toggleEditing}>
                    {isEditing ? "完成" : "编辑"}
                </button>
            </div>

            {/* 主要内容区域 */}
            <div className='flex-1 m-5 flex flex-col space-y-4'>
                {/* 用户头像和名称 */}
                <div className="bg-white rounded-lg">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center flex-1">
                            <Upload
                                accept="image/*"
                                showUploadList={false}
                                onChange={handleAvatarChange}
                            >
                                <div className="relative group cursor-pointer">
                                    <Avatar size={64} src={avatarUrl} className="transition-all duration-300 ease-in-out group-hover:opacity-80" />
                                    <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300`}>
                                        <CameraOutlined className="text-white text-xl" />
                                    </div>
                                </div>
                            </Upload>
                            <div className="ml-4 flex-1">
                                {isEditing ? (
                                    <div className="relative">
                                        <Input
                                            placeholder="请输入昵称"
                                            variant="borderless"
                                            value={nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                            className="w-full text-base pl-0"
                                            maxLength={30}
                                            autoFocus
                                        />
                                        <div className="absolute bottom-0 left-0 w-full h-px bg-gray-100"></div>
                                    </div>
                                ) : (
                                    <span className="text-base pl-0">{nickname}</span>
                                )}
                            </div>
                        </div>
                        {!isEditing && (
                            <QrcodeOutlined
                                className="text-2xl cursor-pointer"
                                onClick={handleQRCodeClick}
                            />
                        )}
                    </div>
                </div>

                {/* 用户信息列表 */}
                <div className="bg-white rounded-lg">
                    <List
                        split={false}
                        size="small"
                        dataSource={userInfoItems.filter(item => item.content)}
                        renderItem={(item) => (
                            <List.Item
                                key={item.title}
                                className="p-2 flex items-center justify-between"
                                onClick={() => !isEditing && handleCopyContent(item.content ?? '')}
                                tabIndex={0}
                            >
                                <List.Item.Meta
                                    title={
                                        <div className="flex items-center justify-between mb-2">
                                            <Text type="secondary" className="text-sm leading-tight">{item.title}</Text>
                                        </div>
                                    }
                                    description={
                                        <div className="relative">
                                            {isEditing ? (
                                                <Input
                                                    placeholder={`请输入${item.title}`}
                                                    variant="borderless"
                                                    value={item.content}
                                                    onChange={(e) => {
                                                        console.log(e)
                                                        // 这里需要添加一个更新 userInfoItems 的函数
                                                        // updateUserInfoItem(item.title, e.target.value);
                                                    }}
                                                    className="w-full text-sm pl-0"
                                                />
                                            ) : (
                                                <Text className="text-sm leading-tight">{item.content}</Text>
                                            )}
                                            {isEditing && (
                                                <div className="absolute bottom-0 left-0 w-full h-px bg-gray-100"></div>
                                            )}
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </div>

                {!isEditing && (
                    <>
                        {/* 更改密码按钮 */}
                        <div className="bg-white rounded-lg p-4 cursor-pointer" onClick={handleChangePassword}>
                            <Flex align="center">
                                <Text>更改密码</Text>
                            </Flex>
                        </div>

                        {/* 登出按钮 */}
                        <div className="bg-white rounded-lg p-4 cursor-pointer" onClick={handleLogoutClick}>
                            <Text className="text-red-500">登出</Text>
                        </div>
                    </>
                )}
            </div>

            {/* 更改密码模态框 */}
            <Modal
                title={<div className="text-center">更改密码</div>}
                open={isPasswordModalVisible}
                onCancel={handlePasswordModalCancel}
                centered
                width={400}
                footer={
                    <div className="flex justify-between w-full">
                        <button
                            className="flex-1 py-2 text-gray-500"
                            onClick={handlePasswordModalCancel}
                        >
                            取消
                        </button>
                        <button
                            className="flex-1 py-2 text-blue-500"
                            onClick={handlePasswordModalOk}
                        >
                            确认
                        </button>
                    </div>
                }
            >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                        <Text className="block mb-2">当前密码</Text>
                        <Input.Password
                            variant="filled"
                            placeholder="请输入当前密码"
                        />
                    </div>
                    <div>
                        <Text className="block mb-2">新密码</Text>
                        <Input.Password
                            variant="filled"
                            placeholder="请输入新密码"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <Text className="block mb-2">确认新密码</Text>
                        <Input.Password
                            variant="filled"
                            placeholder="请确认新密码"
                        />
                    </div>
                </Space>
            </Modal>

            {/* 二维码模态框 */}
            <Modal
                wrapClassName="ant-modal-content-p10"
                open={isQRCodeModalVisible}
                onCancel={handleQRCodeModalClose}
                footer={null}
                centered
                width={320}
            >
                <div className="relative">
                    <div className="absolute top-0 left-0">
                        <Dropdown menu={{ items: qrCodeMenuItems }} placement="bottomLeft">
                            <DotsThree size={32} weight="light" className="cursor-pointer" />
                        </Dropdown>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4" style={{ height: '330px' }}>
                        <Avatar size={60} src={avatarUrl} />
                        <Text strong className="mt-2">{nickname}</Text>
                        <Text type="secondary" className="mt-1">{userId}</Text>
                        <div className="mt-3 w-40 h-40 bg-gray-200 flex items-center justify-center">
                            <Text type="secondary">二维码占位符</Text>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* 登出确认模态框 */}
            <Modal
                width={320}
                title={<div className="text-center">登出</div>}
                open={isLogoutModalVisible}
                onOk={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
                centered
                closable={false}
                footer={
                    <div className="flex justify-between w-full">
                        <button
                            className="flex-1 py-2 text-gray-500"
                            onClick={handleLogoutCancel}
                        >
                            取消
                        </button>
                        <button
                            className="flex-1 py-2 text-red-500"
                            onClick={handleLogoutConfirm}
                        >
                            登出
                        </button>
                    </div>
                }
            >
                <p className="text-center">您确定要登出吗？</p>
            </Modal>
        </Flex>
    );
};

export default UserInfo;