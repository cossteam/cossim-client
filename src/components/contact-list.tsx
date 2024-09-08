import { useState, useEffect, useMemo, useCallback } from 'react'
import { Avatar, List, Divider, Skeleton, Layout, Flex, Typography } from 'antd'
import { Contact, ContactList, generateContactList } from '@/mock/data'
import InfiniteScroll from 'react-infinite-scroll-component'
import { TagsOutlined, UserAddOutlined, UsergroupDeleteOutlined } from '@ant-design/icons'
import { Content } from 'antd/es/layout/layout'
import CustomIcon from './icon'
import { useNavigate } from 'react-router-dom'

// 联系人列表页面组件
const ContactListPage = () => {
    // 定义状态和钩子
    const [loading, setLoading] = useState(false)
    const [contactList, setContactList] = useState<ContactList>({ list: {}, total: 0 })
    const navigate = useNavigate()

    // 处理联系人点击事件
    const handleClick = useCallback((item: Contact) => {
        console.log('item', item)
    }, [])

    // 加载更多联系人数据
    const loadMoreData = useCallback(() => {
        if (loading) return
        setLoading(true)
        const moreContacts = generateContactList(10)
        setContactList((prevState) => ({
            list: { ...prevState.list, ...moreContacts.list },
            total: prevState.total + moreContacts.total
        }))
        setLoading(false)
    }, [loading])

    // 初始加载数据
    useEffect(() => {
        loadMoreData()
    }, [loadMoreData])

    // 定义菜单项
    const menus = useMemo(() => [
        { icon: UserAddOutlined, title: '新的请求', path: '/dashboard/contact/request' },
        { icon: UsergroupDeleteOutlined, title: '群组', path: '/dashboard/contact/group' },
        { icon: TagsOutlined, title: '标签', path: '/dashboard/contact/tag' }
    ], [])

    // 处理菜单项点击事件
    const handlerMenusClick = useCallback((path: string) => {
        navigate(path)
    }, [navigate])

    // 渲染菜单项
    const renderMenuItem = useCallback((item: typeof menus[0], index: number) => (
        <Flex
            className="mobile:py-3 py-2 pl-5 select-none hover:bg-background-hover cursor-pointer rounded"
            key={index}
            gap="middle"
            onClick={() => handlerMenusClick(item.path)}
        >
            <CustomIcon className="mobile:text-2xl text-xl text-gray-500" component={item.icon} />
            <Typography.Text>{item.title}</Typography.Text>
        </Flex>
    ), [handlerMenusClick])

    // 渲染联系人列表项
    const renderContactItem = useCallback((c: Contact) => (
        <List.Item key={c.email} onClick={() => handleClick(c)}>
            <List.Item.Meta
                avatar={<Avatar size={40} src={c.avatar} />}
                title={
                    <div className="truncate max-w-[200px]">
                        {c.preferences?.remark || c.nickname}
                    </div>
                }
            />
        </List.Item>
    ), [handleClick])

    return (
        <Layout className="h-[600px] bg-white">
            <Content id="scrollableDiv" className="flex-1 overflow-auto">
                {/* 渲染菜单项 */}
                {menus.map(renderMenuItem)}
                <Divider className="m-0" />
                {/* 无限滚动列表 */}
                <InfiniteScroll
                    dataLength={contactList.total}
                    next={loadMoreData}
                    loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                    hasMore={contactList.total < 50}
                    endMessage={<Divider plain>已经到底了 🤐</Divider>}
                    scrollableTarget="scrollableDiv"
                >
                    {/* 渲染联系人列表 */}
                    {Object.entries(contactList.list).map(([key, contacts]) => (
                        <div className="my-3 px-5" key={key}>
                            <h3>{key}</h3>
                            <List
                                dataSource={contacts}
                                renderItem={renderContactItem}
                            />
                        </div>
                    ))}
                </InfiniteScroll>
            </Content>
        </Layout>
    )
}

export default ContactListPage
