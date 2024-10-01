import { useMemo, useCallback } from 'react'
import { Avatar, List, Divider, Layout, Flex, Typography } from 'antd'
import { Contact, LetterContact } from '@/types/storage'
import { Content } from 'antd/es/layout/layout'
import { useNavigate, useLocation } from 'react-router-dom'
import { Tag, UserPlus, Users } from '@phosphor-icons/react'
import useContactStore from '@/stores/contact'

// 联系人列表页面组件
const ContactListPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const cacheContactList = useContactStore().getContacts()

    // 定义菜单项
    const menus = useMemo(() => [
        { icon: <UserPlus weight="thin" />, title: '新的请求', path: '/dashboard/contact/request' },
        { icon: <Users weight="thin" />, title: '群组', path: '/dashboard/contact/group' },
        { icon: <Tag weight="thin" />, title: '标签', path: '/dashboard/contact/tag' }
    ], [])

    // 处理菜单项点击事件
    const handleMenuClick = useCallback((path: string) => {
        navigate(path)
    }, [navigate])

    // 渲染菜单项
    const renderMenuItem = useCallback((item: typeof menus[0], index: number) => (
        <Flex
            className={`mobile:py-3 py-2 pl-5 select-none hover:bg-background-hover rounded ${location.pathname === item.path ? 'bg-[#C9ECDA]' : ''}`}
            key={index}
            gap="middle"
            onClick={() => handleMenuClick(item.path)}
        >
            <div className="mobile:text-2xl text-xl">{item.icon}</div>
            <Typography.Text>{item.title}</Typography.Text>
        </Flex>
    ), [handleMenuClick, location.pathname])

    // 渲染联系人列表项
    const renderContactItem = useCallback((c: Contact) => (
        <List.Item 
            key={c.user_id} 
            onClick={() => navigate(`/dashboard/contact/${c.user_id}`)}
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
    ), [navigate, location.pathname])

    return (
        <Layout className="bg-white">
            <div className="sticky">
                    {menus.map(renderMenuItem)}
                    <Divider className="m-0" />
            </div>
            <Content id="scrollableDiv" className="flex-1 overflow-auto">
                {cacheContactList && cacheContactList.every((contactData: LetterContact) => Object.values(contactData).flat().length === 0) ? (
                    <div className="flex justify-center items-center" style={{ minHeight: 'calc(70vh - 50px)' }}>
                        <Typography.Text className="text-gray-400">暂无联系人</Typography.Text>
                    </div>
                ) : (
                    cacheContactList.map((contactData: LetterContact) => {
                        return Object.entries(contactData).map(([key, contacts]) => (
                            <div key={key}>
                                <h3 className="px-5 my-3">{key}</h3>
                                <List
                                    dataSource={contacts}
                                    renderItem={renderContactItem}
                                />
                            </div>
                        ))
                    })
                )}
            </Content>
        </Layout>
    )
}

export default ContactListPage
