import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Segmented, Typography, Flex, List, Avatar, message, Modal, Dropdown } from 'antd';
import useMobile from '@/hooks/useMobile';
import { friendRequestListApi, manageFriendApplyApi, deleteFriendRequestApi, groupRuestListApi } from '@/api/relation';
import { QueryParams, ManageFriendRequestParams } from '@/types/api';
import { formatTime } from '@/utils/format-time';
import { ApplyStatus } from '@/utils/enum';
import { useAuthStore } from '@/stores/auth';
import { Trash } from '@phosphor-icons/react';
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button"
import RequestInfoCard from './request-info-card';
import UserCard from '@/components/user/user-card';

const { Text } = Typography;

const NewRequest: React.FC = () => {
    const { height } = useMobile();
    const [currentTab, setCurrentTab] = useState<string>('所有');
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFullUserCard, setIsFullUserCard] = useState(false);

    const uid = useAuthStore(state => state.userId);

     // 分段选项
    // const segmentOptions = useMemo(() => [
    //     { label: '所有', value: '所有' },
    //     { label: '未处理', value: '未处理' },
    //     { label: '已处理', value: '已处理' }
    // ], []);

    const segmentOptions = useMemo(() => [
        { label: '所有', value: '所有' },
        { label: '联系人', value: '联系人' },
        { label: '群组', value: '群组' }
    ], []);

    // 获取请求列表
    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const params: QueryParams = { page_num: 1, page_size: 10 };
            let response;
            if (currentTab === '联系人') {
                response = await friendRequestListApi(params);
            } else if (currentTab === '群组') {
                response = await groupRuestListApi(params);
            } else {
                const [friendResponse, groupResponse] = await Promise.all([
                    friendRequestListApi(params),
                    groupRuestListApi(params)
                ]);
                response = {
                    code: 200,
                    data: {
                        list: [...(friendResponse.data.list || []), ...(groupResponse.data.list || [])]
                    }
                };
            }
            if (response.code === 200) {
                setRequests(response.data.list || []);
            } else {
                message.error('获取请求列表失败');
            }
        } catch (error) {
            console.error('获取请求列表出错:', error);
            message.error('获取请求列表出错');
        } finally {
            setLoading(false);
        }
    }, [currentTab]);

    // 当前标签页变化时重新获取请求列表
    useEffect(() => {
        fetchRequests();
    }, [currentTab, fetchRequests]);

    // 处理好友请求
    const handleFriendRequest = useCallback(async (id: number, action: number) => {
        try {
            const data: ManageFriendRequestParams = { action };
            const response = await manageFriendApplyApi(id, data);
            if (response.code === 200) {
                message.success(action === 1 ? '已接受好友请求' : '已拒绝好友请求');
                fetchRequests();
                setIsModalVisible(false);
            } else {
                message.error('处理好友请求失败');
            }
        } catch (error) {
            console.error('处理好友请求出错:', error);
            message.error('处理好友请求出错');
        }
    }, [fetchRequests]);

    // 删除单个请求
    const handleDeleteSingleRequest = useCallback(async (id: number) => {
        try {
            await deleteFriendRequestApi(id);
            message.success('请求已删除');
            fetchRequests();
        } catch (error) {
            console.error('删除请求出错:', error);
            message.error('删除请求失败');
        }
    }, [fetchRequests]);

    // 渲染操作按钮
    const renderActions = useCallback((item: any) => {
        const isSender = item.sender_id === uid;

        const buttonStyle = {
            borderRadius: '20px',
            margin: '0 5px'
        };

        const textStyle = {
            margin: '0 10px'
        };

        // 获取状态文本
        const getStatusText = (status: ApplyStatus, isSender: boolean) => {
            const statusTexts = {
                [ApplyStatus.ACCEPT]: '已接受',
                [ApplyStatus.REFUSE]: '已拒绝',
                [ApplyStatus.INVITE_SENDER]: isSender ? '等待对方验证' : '待验证',
                [ApplyStatus.INVITE_RECEIVER]: isSender ? '待验证' : '等待您的验证'
            };
            return statusTexts[status as keyof typeof statusTexts] || '';
        };

        if (item.status === ApplyStatus.PENDING) {
            return [
                <Button variant="outline" key="reject" onClick={(e) => { e.stopPropagation(); handleFriendRequest(item.id, 0); }} style={{ ...buttonStyle, borderColor: '#d9d9d9', color: 'rgba(0, 0, 0, 0.65)' }}>拒绝</Button>,
                <Button variant="default" key="accept" onClick={(e) => { e.stopPropagation(); handleFriendRequest(item.id, 1); }} style={{ ...buttonStyle, backgroundColor: '#26B36D', color: '#fff' }}>接受</Button>
            ];
        }

        return <Text type="secondary" style={textStyle}>{getStatusText(item.status, isSender)}</Text>;
    }, [uid, handleFriendRequest]);

    // 显示用户卡片
    const showUserCard = useCallback((user: any) => {
        setSelectedUser(user);
        setIsModalVisible(true);
    }, []);

    // 关闭模态框
    const handleModalClose = useCallback(() => {
        setIsModalVisible(false);
        setIsFullUserCard(false)
    }, []);

    // 获取用户信息项
    const getUserInfoItems = useCallback((user: any) => [
        { title: '用户ID', content: user.sender_info.coss_id, action: true },
        { title: '昵称', content: user.sender_info.nickname },
        { title: '邮箱', content: user.sender_info.email },
        { title: '来源', content: user.source ?? '未知' }
    ], []);

    // 获取请求信息项
    const getRequestInfoItems = useCallback((user: any) => [
        { title: '用户ID', content: user.sender_info.coss_id, action: true },
        { title: '来源', content: user.source ?? '未知' }
    ], []);

    // 打开对话框
    const handleOpenDialog = useCallback(() => setIsDialogOpen(true), []);
    // 关闭对话框
    const handleCloseDialog = useCallback(() => setIsDialogOpen(false), []);

    // 删除所有请求
    const handleDeleteAllRequests = useCallback(async () => {
        setIsDeleting(true);
        try {
            await Promise.all(requests.map(request => deleteFriendRequestApi(request.id)));
            message.success('所有请求已删除');
            fetchRequests();
        } catch (error) {
            console.error('删除所有请求出错:', error);
            message.error('删除所有请求出错');
        } finally {
            setIsDeleting(false);
            setIsDialogOpen(false);
        }
    }, [requests, fetchRequests]);

    // 渲染列表项
    const renderListItem = useCallback((item: any) => (
        <Dropdown
            menu={{
                items: [
                    {
                        key: '1',
                        label: '删除',
                        onClick: (e) => {
                            e.domEvent.stopPropagation();
                            handleDeleteSingleRequest(item.id);
                        }
                    }
                ]
            }}
            trigger={['contextMenu']}
        >
            <List.Item
                actions={[renderActions(item)]}
                className="py-2.5 px-0"
                onClick={() => showUserCard(item)}
            >
                <List.Item.Meta
                    avatar={<Avatar 
                        className='ml-4' 
                        src={item.sender_info.avatar} 
                        size={48} 
                        onClick={(e?: React.MouseEvent) => { 
                            e?.stopPropagation(); 
                            setIsFullUserCard(true); 
                            showUserCard(item); 
                        }} 
                    />}
                    title={<span className="text-sm font-bold">{item.sender_info.nickname}</span>}
                    description={
                        <Flex vertical>
                            <Text type="secondary" className="text-xs text-gray-400">
                                {formatTime(item.create_at)} <span className="mx-1 border-l border-gray-200"></span> {item.source || '未知'}
                            </Text>
                            {item.remark ? (
                                <Text type="secondary" className="text-xs text-gray-600">
                                    {item.remark}
                                </Text>
                            ) : (
                                <div className="h-[1em]"></div>
                            )}
                        </Flex>
                    }
                    className="flex items-center"
                />
            </List.Item>
        </Dropdown>
    ), [renderActions, showUserCard, handleDeleteSingleRequest]);

    // 渲染组件
    return (
        <Flex className="flex-1 container--background" style={{ height }} vertical>
            {/* 头部 */}
            <div className="h-[49px] flex items-center justify-between bg-white border-b px-4">
                <Text className="flex-1 text-center">新的请求</Text>
                <Trash className='mr-2 cursor-pointer' size={22} weight="thin" onClick={handleOpenDialog} />
            </div>
            {/* 分段控制器 */}
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
            {/* 请求列表 */}
            <div className='flex-1 m-5 bg-white rounded-lg overflow-hidden'>
                <List
                    className="overflow-y-auto max-h-[calc(100vh-200px)]"
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={requests}
                    renderItem={renderListItem}
                />
            </div>

            {/* 删除所有请求的确认对话框 */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent
                    hideCloseButton
                    noPadding
                    className="max-w-[320px] h-[130px] rounded-lg pt-5" >
                    <DialogHeader className="p-0">
                        <DialogTitle>请求信息</DialogTitle>
                        <DialogDescription className="text-xs text-gray-500 pt-2 px-5">
                            您确定要删除所有请求吗？
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter >
                        <div className="flex justify-between w-full ">
                            <Button variant="text" size="lg" className="flex-1 mr-2 text-gray-500 hover:text-gray-500" onClick={handleCloseDialog}>取消</Button>
                            <Button variant="text" size="lg" onClick={handleDeleteAllRequests} disabled={isDeleting} className="flex-1 ml-2 text-red-500 hover:text-red-500">
                                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                确定
                            </Button>
                        </div>
                        <div className="bottom-0 left-0 w-full h-px bg-gray-100"></div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 用户信息模态框 */}
            <Modal
                title={<div className="text-center pt-4">{selectedUser?.status === ApplyStatus.PENDING ? '请求信息' : '用户信息'}</div>}
                wrapClassName="ant-modal-content-p-0"
                style={{
                    maxWidth: isFullUserCard ? 450 : (selectedUser?.status === ApplyStatus.PENDING ? 320 : 450),
                }}
                centered
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={selectedUser?.status === ApplyStatus.PENDING ? (
                    <div className="flex justify-between w-full">
                        <Button variant="text" size="lg" className="flex-1 mr-2 text-gray-500 hover:text-gray-500" onClick={() => handleFriendRequest(selectedUser.id, 0)}>
                            拒绝
                        </Button>
                        <Button variant="text" size="lg" className="flex-1 ml-2 text-[#26B36D] hover:text-[#26B36D]" onClick={() => handleFriendRequest(selectedUser.id, 1)}>
                            接受
                        </Button>
                    </div>
                ) : <div className="flex justify-between w-full"></div>}
            >

                {selectedUser && (
                    <React.Fragment>
                        {isFullUserCard || selectedUser.status !== ApplyStatus.PENDING ? (
                            <UserCard
                                userId={selectedUser.sender_info.coss_id}
                                avatar={selectedUser.sender_info.avatar}
                                nickname={selectedUser.sender_info.nickname}
                                signature={selectedUser.sender_info.signature}
                                userInfoItem={getUserInfoItems(selectedUser)}
                            />
                        ) : (
                            <RequestInfoCard
                                requestId={selectedUser.id}
                                userId={selectedUser.sender_info.coss_id}
                                avatar={selectedUser.sender_info.avatar}
                                nickname={selectedUser.sender_info.nickname}
                                signature={selectedUser.sender_info.signature}
                                userInfoItem={getRequestInfoItems(selectedUser)}
                            />
                        )}
                    </React.Fragment>
                )}
            </Modal>
        </Flex>
    );
};

export default NewRequest;
