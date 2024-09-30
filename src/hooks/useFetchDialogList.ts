import { useEffect } from 'react';
import { getDialogListApi } from '@/api/msg';
import useCacheStore from '@/stores/cache';

const useFetchDialogList = () => {
    const cacheStore = useCacheStore();

    useEffect(() => {
        const fetchDialogList = async () => {
            try {
                const response = await getDialogListApi({ page_num: 1, page_size: 10 });
                cacheStore.update({ cacheChatList: response.data.list });
            } catch (error) {
                console.error('Failed to fetch dialog list:', error);
            }
        };

        fetchDialogList();
    }, []);
};

export default useFetchDialogList;
