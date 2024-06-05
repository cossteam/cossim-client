import { useState, useEffect, useCallback } from 'react'
import { Avatar, List, Divider, Skeleton, Input } from 'antd'
import { Contact, ContactList, generateContactList } from '@/mock/data'
import InfiniteScroll from 'react-infinite-scroll-component'
import { SearchOutlined } from '@ant-design/icons'
import useCacheStore from '@/stores/cache'

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
        if (loading) return

        setLoading(true)
        // 模拟加载更多数据的逻辑
        const moreContacts = generateContactList(10) // 加载更多联系人
        setContactList((prevState) => ({
            list: { ...prevState.list, ...moreContacts.list },
            total: prevState.total + moreContacts.total
        }))
        setOriginalContactList((prevState) => ({
            list: { ...prevState.list, ...moreContacts.list },
            total: prevState.total + moreContacts.total
        }))
        setLoading(false)
    }

    useEffect(() => {
        const fetchContactsFromCache = async () => {
            try {
                const cachedContacts = cacheStore.cacheContactList
                if (cachedContacts && cachedContacts.length > 0) {
                    const formattedContactList: ContactList = {
                        list: {},
                        total: cachedContacts.length
                    }

                    cachedContacts.forEach((contact) => {
                        const firstLetter = contact.nickname.charAt(0).toUpperCase()
                        formattedContactList.list[firstLetter] = formattedContactList.list[firstLetter] || []
                        formattedContactList.list[firstLetter].push(contact)
                    })

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

            setSearchLoading(true) // 开始搜索，显示Skeleton

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

    return (
        <div
            id="scrollableDiv"
            style={{
                height: 600,
                width: '100%',
                overflow: 'auto'
            }}
        >
            <Input
                status="warning"
                onChange={handleSearch}
                prefix={
                    <SearchOutlined
                        style={{
                            color: 'rgba(0,0,0,.25)',
                            paddingRight: '10px'
                        }}
                    />
                }
                placeholder="搜索"
                allowClear
                variant="borderless"
            />
            <Divider
                style={{
                    marginTop: '10px',
                    marginBottom: '0px'
                }}
                type="horizontal"
            ></Divider>

            {data.length === 0 && !searchLoading ? (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>无结果</div>
            ) : (
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
                                            title={c.nickname}
                                            description={c.signature}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    ))}
                </InfiniteScroll>
            )}
        </div>
    )
}

export default ContactListPage
