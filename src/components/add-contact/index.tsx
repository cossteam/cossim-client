import { SearchOutlined } from '@ant-design/icons'
import { Avatar, Input, List, Modal, Empty, Spin } from 'antd'
import { Divider } from 'antd'
import { useEffect, useState, useCallback, useMemo } from 'react'
import UserCard from '@/components/user/user-card'
import useMobile from '@/hooks/useMobile'
import InfiniteScroll from 'react-infinite-scroll-component'

interface AddContactProps {
    onClick?: (item: User) => void
}

interface User {
    email: string
    nickname: string
    avatar: string
    signature: string
}

const mockData: User[] = [
    {
        email: 'zhangsan@example.com',
        nickname: '张三',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=male',
        signature: '生活就像一盒巧克力'
    },
    {
        email: 'lisi@example.com',
        nickname: '李四',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=female',
        signature: '每一天都是新的开始'
    },
    {
        email: 'wangwu@example.com',
        nickname: '王五',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=male',
        signature: '保持积极乐观的态度'
    },
    {
        email: 'zhaoliu@example.com',
        nickname: '赵六',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=female',
        signature: '努力工作，快乐生活'
    },
    {
        email: 'qianqi@example.com',
        nickname: '钱七',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=male',
        signature: '学无止境'
    },
    {
        email: 'sunba@example.com',
        nickname: '孙八',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=female',
        signature: '享受当下，珍惜眼前'
    },
    {
        email: 'zhoujiu@example.com',
        nickname: '周九',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=male',
        signature: '勇往直前，永不言弃'
    },
    {
        email: 'wushi@example.com',
        nickname: '吴十',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=female',
        signature: '微笑面对每一天'
    },
    {
        email: 'zhengyi@example.com',
        nickname: '郑一',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=male',
        signature: '保持好奇心，永远年轻'
    },
    {
        email: 'wanger@example.com',
        nickname: '王二',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=female',
        signature: '做最好的自己'
    }
]

const userInfoItem = [
    { title: '用户ID', content: '1', action: true },
    { title: '昵称', content: 't' },
    { title: '来源', content: '搜索' }
]

const AddContact: React.FC<AddContactProps> = ({ onClick }) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [searchText, setSearchText] = useState<string>('')
    const { height } = useMobile()
    const [displayedData, setDisplayedData] = useState<User[]>([])
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)

    const handleClick = useCallback((user: User) => {
        onClick?.(user)
        console.log('用户', user)
        setSelectedUser(user)
        setModalOpen(true)
    }, [onClick])

    useEffect(() => {
        document.body.style.overflow = modalOpen ? 'hidden' : 'auto'
        return () => { document.body.style.overflow = 'auto' }
    }, [modalOpen])

    const filteredData = useMemo(() => {
        if (!searchText) return []
        return mockData.filter(user => 
            user.email.toLowerCase().includes(searchText.toLowerCase()) ||
            user.nickname.toLowerCase().includes(searchText.toLowerCase())
        )
    }, [searchText])

    useEffect(() => {
        setDisplayedData(filteredData.slice(0, 5))
        setHasMore(filteredData.length > 5)
    }, [filteredData])

    const loadMoreData = () => {
        if (displayedData.length >= filteredData.length) {
            setHasMore(false)
            return
        }
        setLoading(true)
        setTimeout(() => {
            const newData = filteredData.slice(displayedData.length, displayedData.length + 5)
            setDisplayedData(prevData => [...prevData, ...newData])
            setLoading(false)
        }, 1000)
    }

    const resultHeight = useMemo(() => {
        if (!searchText || filteredData.length === 0) return 150
        return filteredData.length > 3 ? 450 : 150
    }, [searchText, filteredData])

    return (
        <div className="flex flex-col justify-center">
            <div className="w-full px-4 -mt-2 pt-4">
                <Input
                    className="w-full"
                    prefix={<SearchOutlined className="text-gray-400 pr-2" />}
                    placeholder="Coss ID / 邮箱"
                    allowClear
                    variant="filled"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>
            <Divider className="m-0 mt-4 w-full" />
            <div style={{height: resultHeight, overflowY: 'auto'}} id="scrollableDiv">
                {!searchText ? (
                    <Empty className='pt-5' description="请输入搜索内容" />
                ) : filteredData.length === 0 ? (
                    <Empty className='pt-5' image={Empty.PRESENTED_IMAGE_SIMPLE} description="未找到用户或他们禁用了搜索" />
                ) : (
                    <InfiniteScroll
                        dataLength={displayedData.length}
                        next={loadMoreData}
                        hasMore={hasMore}
                        loader={<Spin className="w-full flex justify-center py-4" />}
                        scrollableTarget="scrollableDiv"
                    >
                        <List
                            dataSource={displayedData}
                            renderItem={(user) => (
                                <List.Item key={user.email} className="hover:text-blue-500">
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                className="cursor-pointer"
                                                size={40}
                                                src={user.avatar}
                                                onClick={() => handleClick(user)}
                                            />
                                        }
                                        title={
                                            <p className="cursor-pointer" onClick={() => handleClick(user)}>
                                                {user.nickname}
                                            </p>
                                        }
                                        description={user.signature}
                                    />
                                </List.Item>
                            )}
                        />
                    </InfiniteScroll>
                )}
            </div>

            <Modal
                // className="bg-gray-100 rounded-xl"
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
                    <UserCard
                        avatar={selectedUser.avatar}
                        nickname={selectedUser.nickname}
                        signature={selectedUser.signature}
                        userInfoItem={userInfoItem}
                        groupCount={5}
                    />
                )}
            </Modal>
        </div>
    )
}

export default AddContact
