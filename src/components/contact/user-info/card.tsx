import React, { useCallback, useEffect, useState } from 'react';
import ContactCard from './contact-card';
import NotContactCard from '@/components/user-card/not-contact-card';
import { Contact } from '@/types/storage';
import {  getUserInfoApi } from '@/api/user';
import { message } from 'antd';
import useContactStore from '@/stores/contact';

interface UserCardProps {
    userId: string;
}

const UserCard: React.FC<UserCardProps> = ({ userId }) => {
    const isContact = useContactStore.getState().isContact(userId);
    const [userInfo, setUserInfo] = useState<Contact | null>(null);

    const fetchUserInfo = useCallback(async () => {
        try {
            const response = await getUserInfoApi({ id: userId });
            if (response.code === 200) {
                setUserInfo(response.data);
            } else {
                message.error('获取用户信息失败: ' + response.msg);
                message.error('获取用户信息失败');
            }
        } catch (error) {
            console.error('获取用户信息出错:', error);
            message.error('获取用户信息失败，请稍后重试');
        }
    }, [userId]);

    useEffect(() => {
        // setUserInfo(null); // 清空之前的用户信息
        fetchUserInfo();
    }, [userId, fetchUserInfo]);

    if (!userInfo) {
        return null
    }

    return (
        <>
            {isContact && userInfo ? (
                <ContactCard {...userInfo} />
            ) : (
                <NotContactCard {...userInfo} />
            )}
        </>
    );
}

export default UserCard;