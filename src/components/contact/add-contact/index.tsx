import { SearchOutlined } from '@ant-design/icons'
import { Avatar, Input, List, Modal, Spin, ConfigProvider, Typography } from 'antd'
import { Divider } from 'antd'
import { useEffect, useState, useCallback, useMemo } from 'react'
import useMobile from '@/hooks/useMobile'
import InfiniteScroll from 'react-infinite-scroll-component'
import { searchUserApi } from '@/api/user'
import { debounce } from 'lodash'
import NotContactCard from '@/components/user/not-contact-card'

interface AddContactProps {
    onClick?: (item: User) => void
}

interface User {
    user_id: string,
    email: string
    nickname: string
    avatar: string
    signature: string
}

const mockData: User[] = [
    {
        user_id: "1",
        email: 'zhangsan@example.com',
        nickname: '张三',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=male',
        signature: '生活就像一盒巧克力'
    },
    // ...
]

const AddContact: React.FC<AddContactProps> = ({ onClick }) => {
    // 状态管理
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [displayedData, setDisplayedData] = useState<User[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // 获取移动设备高度
    const { height } = useMobile();

    // 处理用户点击事件
    const handleClick = useCallback((user: User) => {
        onClick?.(user);
        console.log('选中用户', user);
        setSelectedUser(user);
        setModalOpen(true);
    }, [onClick]);

    // 控制模态框打开时的页面滚动
    useEffect(() => {
        document.body.style.overflow = modalOpen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [modalOpen]);

    // TODO 暂时保留
    // 根据搜索文本过滤用户数据
    const filteredData = useMemo(() => {
        if (!searchText) return [];
        return mockData.filter(user =>
            user.email.toLowerCase().includes(searchText.toLowerCase()) ||
            user.nickname.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText]);

    // TODO 暂时保留
    // 更新显示的数据
    useEffect(() => {
        setDisplayedData(filteredData.slice(0, 5));
        setHasMore(filteredData.length > 5);
    }, [filteredData]);

    // 加载更多数据
    const loadMoreData = useCallback(() => {
        if (displayedData.length >= filteredData.length) {
            setHasMore(false);
            return;
        }
        setLoading(true);
        setTimeout(() => {
            const newData = filteredData.slice(displayedData.length, displayedData.length + 5);
            setDisplayedData(prevData => [...prevData, ...newData]);
            setLoading(false);
        }, 1000);
    }, [displayedData.length, filteredData]);

    // 搜索用户
    const searchUser = useCallback(async (keyword: string) => {
        if (!keyword) {
            setDisplayedData([]);
            setHasMore(false);
            setIsSearching(false);
            return;
        }
        setLoading(true);
        setIsSearching(true);
        try {
            const response = await searchUserApi({ email: keyword });
            if (response.code === 200 && response.data) {
                setDisplayedData([response.data]);
                setHasMore(false);
            } else {
                // TODO 暂时注释
                // setDisplayedData([]);
                setHasMore(false);
            }
        } catch (error) {
            console.error('搜索用户失败:', error);
            setDisplayedData([]);
            setHasMore(false);
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    }, []);

    // 使用防抖优化搜索
    const debouncedSearchUser = useMemo(() =>
        debounce((value: string) => searchUser(value), 300),
        [searchUser]);

    // 处理搜索输入
    const handleSearchInput = useCallback((value: string) => {
        setSearchText(value);
        setIsSearching(true);
        debouncedSearchUser(value);
    }, [debouncedSearchUser]);


    // const getUserInfoItems = (user: User) => [
    //     { title: '用户ID', content: user.user_id, action: true },
    //     { title: '昵称', content: user.nickname },
    //     { title: '邮箱', content: user.email }
    // ];

    // 渲染搜索结果列表
    const renderSearchResults = () => {
        if (loading) {
            return <Spin className="w-full flex justify-center" />;
        }
        if (!searchText) {
            return null;
        }
        if (displayedData.length === 0 && !loading && !isSearching) {
            return <Typography.Text type="secondary" className="text-center w-full text-xs">未找到用户或他们禁用了搜索</Typography.Text>;
        }
        if (displayedData.length > 0) {
            return (
                <div className='w-full'>
                    <InfiniteScroll
                        dataLength={displayedData.length}
                        next={loadMoreData}
                        hasMore={hasMore}
                        loader={<Spin className="w-full flex justify-center" />}
                        scrollableTarget="scrollableDiv"
                    >
                        <List
                            dataSource={displayedData}
                            renderItem={(user) => (
                                <List.Item
                                    key={user.email}
                                    className="flex items-center p-0 hover:bg-[#F5F5F5]"
                                    onClick={() => handleClick(user)}
                                >
                                    <div className="flex items-center px-5 w-full">
                                        <Avatar
                                            size={40}
                                            src={user.avatar}
                                            className="mr-3"
                                        />
                                        <span>{user.nickname}</span>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </InfiniteScroll>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col justify-center">
            <div className="w-full px-4 -mt-2 pt-4">
                <ConfigProvider
                    theme={{
                        components: {
                            Input: {
                                activeBorderColor: '',
                                activeBg: '#F5F5F5',
                            },
                        },
                    }}
                >
                    <Input
                        className="w-full rounded-lg"
                        prefix={<SearchOutlined className="text-gray-400 pr-2" />}
                        placeholder="Coss ID / 邮箱"
                        allowClear
                        variant="filled"
                        value={searchText}
                        onChange={(e) => handleSearchInput(e.target.value)}
                    />
                </ConfigProvider>
            </div>
            <Divider className="m-0 mt-4 w-full" />
            <div className='h-[65px] flex items-center overflow-y-auto' id="scrollableDiv">
                {renderSearchResults()}
            </div>

            <Modal
                style={{
                    maxHeight: height / 1.1,
                    overflowY: 'auto',
                    maxWidth: 400,
                    minHeight: 520,
                }}
                centered
                wrapClassName="ant-modal-content-prl0"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
            >
                {selectedUser && (
                    <NotContactCard
                        userId={selectedUser.user_id}
                        email={selectedUser.email}
                        avatar={selectedUser.avatar}
                        nickname={selectedUser.nickname}
                        signature={selectedUser.signature}
                    />
                )}
            </Modal>

        </div>
    );
};

export default AddContact
