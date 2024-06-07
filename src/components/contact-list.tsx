import { useState, useEffect, useCallback } from 'react'
import { Avatar, List, Divider, Skeleton, Input, Layout } from 'antd'
import { Contact, ContactList } from '@/mock/data'
import InfiniteScroll from 'react-infinite-scroll-component'
import { SearchOutlined } from '@ant-design/icons'
import useCacheStore from '@/stores/cache'
import { Button } from 'antd'
import { arrayToGroups } from '@/utils/utils'
import { Header, Content, Footer } from 'antd/es/layout/layout'

// mock数据
// useEffect(() => {
//     const contacts = generateContactList(10) // 假设我们需要 10 个联系人
//     setContactList(contacts)
//     setOriginalContactList(contacts)
// }, [])

const ContactListPage = () => {
    const [loading, setLoading] = useState(false)
    const [contactList, setContactList] = useState<ContactList>({ list: {}, total: 0 })
    const [originalContactList, setOriginalContactList] = useState<ContactList>({ list: {}, total: 0 })
    const [data, setData] = useState<{ key: string; list: Contact[] }[]>([])

    const [searchLoading, setSearchLoading] = useState(false)

    const cacheStore = useCacheStore()

    const loadMoreData = () => {
        // if (loading) return
        // setLoading(true)
        // // 模拟加载更多数据的逻辑
        // const moreContacts = generateContactList(10) // 加载更多联系人
        // setContactList((prevState) => ({
        //     list: { ...prevState.list, ...moreContacts.list },
        //     total: prevState.total + moreContacts.total
        // }))
        // setOriginalContactList((prevState) => ({
        //     list: { ...prevState.list, ...moreContacts.list },
        //     total: prevState.total + moreContacts.total
        // }))
        // setLoading(false)
    }

    useEffect(() => {
        const fetchContactsFromCache = async () => {
            try {
                const cachedContacts = arrayToGroups(cacheStore.cacheContactList)

                if (cachedContacts && Object.keys(cachedContacts).length > 0) {
                    const formattedContactList: ContactList = Object.keys(cachedContacts).reduce(
                        (acc, group) => {
                            acc.list[group] = cachedContacts[group]
                            acc.total += cachedContacts[group].length
                            return acc
                        },
                        { list: {}, total: 0 } as ContactList
                    )

                    setContactList(formattedContactList)
                    setOriginalContactList(formattedContactList)
                }
            } catch (err) {
                console.error('Failed to fetch contacts from cache', err)
            }
        }

        fetchContactsFromCache()
    }, [cacheStore.cacheContactList])

    useEffect(() => {
        const arr = []
        for (const key in contactList.list) {
            if (Object.prototype.hasOwnProperty.call(contactList.list, key)) {
                arr.push({
                    list: contactList.list[key],
                    key
                })
            }
        }
        setData(arr.sort((a, b) => a.key.localeCompare(b.key)))
    }, [contactList])

    // TODO: 优化搜索时加上骨架效果，搜索完成结束骨架效果
    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.toLowerCase()

            if (!value) {
                setContactList(originalContactList)
                return
            }

            const filteredList = { list: {}, total: 0 }

            for (const key in originalContactList.list) {
                if (Object.prototype.hasOwnProperty.call(originalContactList.list, key)) {
                    const filteredContacts = originalContactList.list[key].filter(
                        (contact) =>
                            contact.nickname.toLowerCase().includes(value) ||
                            contact.email.toLowerCase().includes(value) ||
                            contact.signature.toLowerCase().includes(value)
                    )

                    if (filteredContacts.length > 0) {
                        // @ts-ignore
                        filteredList.list[key] = filteredContacts
                        filteredList.total += filteredContacts.length
                    }
                }
            }

            setContactList(filteredList)
            setSearchLoading(false) // 结束搜索，隐藏Skeleton
        },
        [originalContactList]
    )

    const handleAddClick = () => {
        console.log('handleAddClick')
    }
    return (
        <Layout className="h-[600px] bg-white">
            <Header className="p-0 bg-white">
                <Input
                    className="p-0"
                    status="warning"
                    onChange={handleSearch}
                    prefix={<SearchOutlined className="text-gray-400 pr-2" />}
                    placeholder="搜索"
                    allowClear
                    variant="borderless"
                />
            </Header>
            <Content id="scrollableDiv" className="flex-1 overflow-auto mb-2">
                <InfiniteScroll
                    dataLength={contactList.total}
                    next={loadMoreData}
                    loader={searchLoading && <Skeleton avatar paragraph={{ rows: 1 }} active />}
                    hasMore={contactList.total < 50}
                    endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                    scrollableTarget="scrollableDiv"
                >
                    {data.map((item, index) => (
                        <div className="my-3" key={index}>
                            {item.key}
                            <List
                                dataSource={item.list}
                                renderItem={(c) => (
                                    <List.Item key={c.email}>
                                        <List.Item.Meta
                                            avatar={<Avatar size={40} src={c.avatar} />}
                                            title={c.preferences?.remark || c.nickname}
                                            description={c.signature}
                                        />
                                    </List.Item>
                                )}
                            />
                            {/* TODO: 分组之间应该要有一个更长的分隔符 */}
                            {/* {index !== data.length - 1 && <Divider />} */}
                        </div>
                    ))}
                </InfiniteScroll>
            </Content>
            <Footer className="p-0 bg-white">
                <Button type="text" onClick={handleAddClick}>
                    添加
                </Button>
            </Footer>
        </Layout>

        // TODO: 上面是antd布局，下面是原生布局

        // <div>
        //     {/* 头部：联系人搜索框 */}
        //     <div style={{ marginBottom: '10px' }}>
        //         <Input
        //             status="warning"
        //             onChange={handleSearch}
        //             prefix={
        //                 <SearchOutlined
        //                     style={{
        //                         color: 'rgba(0,0,0,.25)',
        //                         paddingRight: '10px'
        //                     }}
        //                 />
        //             }
        //             placeholder="搜索"
        //             allowClear
        //             variant="borderless"
        //         />
        //     </div>

        //     {/* 中部：联系人列表 */}
        //     <div
        //         id="scrollableDiv"
        //         style={{
        //             height: 500,
        //             width: '100%',
        //             overflow: 'auto',
        //             marginBottom: '10px'
        //         }}
        //     >
        //         {data.length === 0 && !searchLoading ? (
        //             <div style={{ textAlign: 'center', marginTop: '20px' }}>无结果</div>
        //         ) : (
        //             <InfiniteScroll
        //                 dataLength={contactList.total}
        //                 next={loadMoreData}
        //                 loader={searchLoading && <Skeleton avatar paragraph={{ rows: 1 }} active />}
        //                 hasMore={contactList.total < 50}
        //                 endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        //                 scrollableTarget="scrollableDiv"
        //             >
        //                 {data.map((item, index) => (
        //                     <div className="my-3" key={index}>
        //                         {item.key}
        //                         <List
        //                             dataSource={item.list}
        //                             renderItem={(c) => (
        //                                 <List.Item key={c.email}>
        //                                     <List.Item.Meta
        //                                         avatar={<Avatar size={40} src={c.avatar} />}
        //                                         title={c.preferences.remark || c.nickname}
        //                                         description={c.signature}
        //                                     />
        //                                 </List.Item>
        //                             )}
        //                         />
        //                         {/* {index !== data.length - 1 && <Divider />} */}
        //                     </div>
        //                 ))}
        //             </InfiniteScroll>
        //         )}
        //     </div>

        //     {/* 底部按钮 */}
        //     <div style={{ textAlign: 'left' }}>
        //         <Button type="text" onClick={() => {}}>
        //             添加
        //         </Button>
        //     </div>
        // </div>
    )
}

export default ContactListPage
