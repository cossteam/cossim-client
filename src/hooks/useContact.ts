import { useCallback, useEffect } from 'react';
import { getFriendListApi } from '@/api/relation';
import useContactStore from '@/stores/contact';
import { message } from 'antd';
import { ContactData, Contact } from '@/types/storage';

const useContact = () => {
    const { cacheContactList, update } = useContactStore();

    const loadContactData = useCallback(async () => {
        try {
            const response = await getFriendListApi();
            if (response.code === 200) {
                const convertedData: ContactData[] = Object.entries(response.data.list).map(([key, value]) => ({
                    [key]: value as Contact[]
                }));
                update({ cacheContactList: convertedData });
            } else {
                message.error('获取联系人列表失败: ' + response.msg);
            }
        } catch (error) {
            console.error('获取联系人列表出错:', error);
            message.error('获取联系人列表出错');
        }
    }, [update]);

    useEffect(() => {
        loadContactData();
    }, [loadContactData]);

    return { cacheContactList };
};

export default useContact;
