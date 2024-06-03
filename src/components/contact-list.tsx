import { useState, useEffect, useCallback } from 'react'
import { Avatar, List, Divider, Skeleton, Input } from 'antd'
import { Contact, ContactList, generateContactList } from '@/mock/data'
import InfiniteScroll from 'react-infinite-scroll-component'
import { SearchOutlined } from '@ant-design/icons'

const ContactListPage = () => {
    const [loading, setLoading] = useState(false)
    const [contactList, setContactList] = useState<ContactList>({ list: {}, total: 0 })
    const [originalContactList, setOriginalContactList] = useState<ContactList>({ list: {}, total: 0 })
    const [data, setData] = useState<{ key: string; list: Contact[] }[]>([])

    const loadMoreData = () => {
        if (loading) {
            return
        }
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
        const contacts = generateContactList(10) // 假设我们需要 10 个联系人
        setContactList(contacts)
        setOriginalContactList(contacts)
    }, [])

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
                // padding: '0 16px'
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

            <InfiniteScroll
                dataLength={contactList.total}
                next={loadMoreData}
                hasMore={contactList.total < 50}
                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
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
        </div>
    )
}

export default ContactListPage
