import { Modal, Input, message, Typography, Divider } from "antd"
import { useCallback, useMemo, useState } from "react";
import { Prohibit, UserPlus } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button';
import { addFriendApi } from '@/api/relation'
import UserCard from "@/components/user-card";
import useContactStore from "@/stores/contact";

const { Text } = Typography;

interface NotContactCardProps {
    user_id: string
    avatar?: string
    nickname?: string
    signature?: string
    email?: string
}

const NotContactCard: React.FC<NotContactCardProps> = ({ user_id, avatar, nickname, signature, email }) => {
    const [openRequest, setOpenRequest] = useState(false);
    const [openBlacklist, setOpenBlacklist] = useState(false);
    const [remark, setRemark] = useState('');

    const isInBlacklist = useContactStore(state => state.isInBlacklist);
    const removeFromBlacklist = useContactStore(state => state.removeFromBlacklist);

    const handleSendRequest = useCallback(async () => {
        if (!user_id) {
            return message.error('用户ID不存在');
        }

        try {
            const response = await addFriendApi({
                user_id: user_id,
                remark: remark,
            });

            if (response.code !== 200) {
                return message.error(response.msg || '发送请求失败');
            }

            message.success('好友请求发送成功');
            handleCancel();
        } catch (error) {
            console.error('发送好友请求时出错:', error);
            message.error('发送请求失败，请稍后重试');
        }
    }, [user_id, remark]);


    function handleAddContact(): void {
        setOpenRequest(true)
    }

    function handleAddToBlacklist(): void {
        setOpenBlacklist(true);
    }

    const handleConfirmBlacklist = () => {
        setOpenBlacklist(false);
    };

    const handleCancelBlacklist = () => {
        setOpenBlacklist(false);
    };

    const handleCancel = () => {
        setOpenRequest(false);
        setRemark('');
    };

    const handleRemoveFromBlacklist = () => {
        removeFromBlacklist(user_id);
        message.success('已从黑名单中移除');
    };

    const getUserInfoItems = useMemo(() => [
        { title: '用户ID', content: user_id, action: true },
        { title: '昵称', content: nickname || '未设置' },
        { title: '邮箱', content: email || '未设置' }
    ], [user_id, nickname, email]);

    const renderActionButton = (icon: React.ReactNode, text: string, onClick: () => void) => (
        <div className="flex-1 flex flex-col items-center justify-center text-green-500 hover:text-green-600 cursor-pointer" onClick={onClick}>
            {icon}
            <span className="mt-1">{text}</span>
        </div>
    );

    return (
        <div className='bg-gray-100 rounded-lg'>
            <UserCard
                userId={user_id}
                avatar={avatar}
                nickname={nickname as string}
                signature={signature}
                userInfoItem={getUserInfoItems}
                actions={
                    !isInBlacklist(user_id) ? (
                        <div className="flex justify-between w-full flex-grow">
                            {renderActionButton(<UserPlus weight='bold' className="text-2xl" />, "添加", handleAddContact)}
                            {renderActionButton(<Prohibit weight="bold" className="text-2xl" />, "加入黑名单", handleAddToBlacklist)}
                        </div>
                    ) : undefined
                }
                additionalInfoSlot={
                    isInBlacklist(user_id) ? (
                        <div key="footer" className="h-[50px] flex justify-center items-center w-full">
                            <Button 
                                variant='text'
                                className="text-red-500" 
                                onClick={handleRemoveFromBlacklist}
                            >
                                移除黑名单
                            </Button>
                        </div> 
                    ) : <div></div>
                }
            />

            <Modal
                className="bg-gray-100 rounded-xl"
                title={<div className="text-center">添加联系人</div>}
                open={openRequest}
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
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="h-1 mt-2 bg-white"></div>
                </div>
            </Modal>

            <Modal
                className="bg-gray-100 rounded-xl"
                title={<div className="text-center">加入黑名单</div>}
                open={openBlacklist}
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
    )
}

export default NotContactCard
