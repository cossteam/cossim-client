import { useState, useEffect, useMemo, useCallback } from 'react'
import { Avatar, List, Divider, Layout, Flex, Typography } from 'antd'
import { Contact } from '@/types/storage'
import { Content } from 'antd/es/layout/layout'
import { useNavigate, useLocation } from 'react-router-dom'
import { Tag, UserPlus, Users } from '@phosphor-icons/react'
import { getFriendListApi, FriendListData } from '@/api/relation'

// 联系人列表页面组件
const ContactListPage = () => {
    // 定义状态和钩子
    const [loading, setLoading] = useState(false)
    const [contactList, setContactList] = useState<FriendListData>({ list: {}, total: 0 })
    const [hasMore, setHasMore] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()

    // 加载联系人数据
    const loadContactData = useCallback(async () => {
        if (loading || !hasMore) return
        setLoading(true)
        try {
            const response = await getFriendListApi()
            if (response.code === 200) {
                setContactList(prevList => ({
                    list: { ...prevList.list, ...response.data.list },
                    total: response.data.total
                }))
                setHasMore(Object.keys(response.data.list).length > 0)
            } else {
                console.error('获取联系人列表失败:', response.msg)
                setHasMore(false)
            }
        } catch (error) {
            console.error('获取联系人列表出错:', error)
            setHasMore(false)
        } finally {
            setLoading(false)
        }
    }, [loading, hasMore])

    useEffect(() => {
        loadContactData()
    }, [])

    // 处理联系人点击事件
    const handleClick = useCallback((item: Contact) => {
        navigate(`/dashboard/contact/${item.user_id}`)
    }, [navigate])

    // 定义菜单项
    const menus = useMemo(() => [
        { icon: <UserPlus weight="thin" />, title: '新的请求', path: '/dashboard/contact/request' },
        { icon: <Users weight="thin" />, title: '群组', path: '/dashboard/contact/group' },
        { icon: <Tag weight="thin" />, title: '标签', path: '/dashboard/contact/tag' }
    ], [])

    // 处理菜单项点击事件
    const handlerMenusClick = useCallback((path: string) => {
        navigate(path)
    }, [navigate])

    // 渲染菜单项
    const renderMenuItem = useCallback((item: typeof menus[0], index: number) => (
        <Flex
            className={`mobile:py-3 py-2 pl-5 select-none hover:bg-background-hover rounded ${location.pathname === item.path ? 'bg-[#C9ECDA]' : ''}`}
            key={index}
            gap="middle"
            onClick={() => handlerMenusClick(item.path)}
        >
            <div className="mobile:text-2xl text-xl">{item.icon}</div>
            <Typography.Text>{item.title}</Typography.Text>
        </Flex>
    ), [handlerMenusClick, location.pathname])

    // 渲染联系人列表项
    const renderContactItem = useCallback((c: Contact) => (
        <List.Item 
            key={c.user_id} 
            onClick={() => handleClick(c)}
            className={`px-5 ${location.pathname === `/dashboard/contact/${c.user_id}` ? 'bg-[#C9ECDA]' : ''}`}
        >
            <List.Item.Meta
                className='px-5'
                avatar={<Avatar size={40} src={c.avatar} />}
                title={
                    <div className="truncate max-w-[200px]">
                        {c.preferences?.remark || c.nickname}
                    </div>
                }
                description={<span className="text-xs text-gray-400">最后上线于</span>}
            />
        </List.Item>
    ), [handleClick, location.pathname])

    // 将联系人列表转换为扁平数组
    const flattenedContactList = useMemo(() => {
        return Object.entries(contactList.list).flatMap(([letter, contacts]) => {
            return [
                { type: 'letter', value: letter },
                ...contacts.map(contact => ({ type: 'contact', value: contact }))
            ];
        });
    }, [contactList.list]);

    // TODO 使用VirtualList优化
    return (
        <Layout className="h-[600px] bg-white">
            <Content id="scrollableDiv" className="flex-1 overflow-auto">
                {/* 渲染菜单项 */}
                {menus.map(renderMenuItem)}

                <Divider className="m-0" />

                {/* 渲染联系人列表 */}
                {Object.entries(contactList.list).map(([key, contacts]) => (
                    <div key={key}>
                        <h3 className="px-5 my-3">{key}</h3>
                        <List
                            dataSource={contacts}
                            renderItem={renderContactItem}
                        />
                    </div>
                ))}
            </Content>
        </Layout>
    )
}

export default ContactListPage
