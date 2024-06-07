import { SearchOutlined } from '@ant-design/icons'
import { Avatar, Input, List, Modal } from 'antd'
import { Divider } from 'antd'
import { useEffect, useState } from 'react'
import UserCard from '@/components/user/user-card'
import useMobile from '@/hooks/useMobile'

interface AddContactProps {
    onClick?: (item: any) => void
}

const data = [
    {
        email: '1',
        nickname: 'Aaron',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=male',
        signature: '1'
    },
    {
        email: '2',
        nickname: 'Abby',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=female',
        signature: '2'
    },
    {
        email: '2',
        nickname: 'Abby',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=female',
        signature: '2'
    },
    {
        email: '2',
        nickname: 'Abby',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=female',
        signature: '2'
    },
    {
        email: '2',
        nickname: 'Abby',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=female',
        signature: '2'
    },
    {
        email: '2',
        nickname: 'Abby',
        avatar: 'https://xsgames.co/randomusers/avatar.php?g=female',
        signature: '2'
    }
]

const userInfoItem = [
    {
        title: '用户ID',
        content: '1',
        action: true
    },
    {
        title: '昵称',
        content: 't'
    },
    {
        title: '来源',
        content: '搜索'
    }
]

const AddContact: React.FC<AddContactProps> = ({ onClick }) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [selectedUser, setSelectedUser] = useState<any>(null)

    const handleClick = (item: any) => {
        if (onClick) {
            onClick(item)
        }
        console.log('item', item)
        setSelectedUser(item)
        setModalOpen(true)
    }

    useEffect(() => {
        if (modalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [modalOpen])

    const { height } = useMobile()

    return (
        <div className="flex flex-col justify-center">
            <div className="w-full pl-8 pr-16 -mt-2 pt-4">
                <Input
                    className="mx-4"
                    prefix={<SearchOutlined className="text-gray-400 pr-2" />}
                    placeholder="Coss ID / 邮箱"
                    allowClear
                    variant="filled"
                />
            </div>
            <Divider className="m-0 mt-4 w-full" />
            <div className="h-[400px] px-8 overflow-auto">
                <List
                    dataSource={data}
                    renderItem={(c) => (
                        <List.Item key={c.email} className="hover:text-blue-500">
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        className="cursor-pointer"
                                        size={40}
                                        src={c.avatar}
                                        onClick={() => handleClick(c)}
                                    />
                                }
                                title={
                                    <p className="cursor-pointer" onClick={() => handleClick(c)}>
                                        {c.nickname}
                                    </p>
                                }
                                description={c.signature}
                            />
                        </List.Item>
                    )}
                />
            </div>

            <Modal
                style={{
                    maxHeight: height / 1.1,
                    overflowY: 'auto',
                    maxWidth: 400
                }}
                centered
                wrapClassName="ant-modal-content-p-0"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
            >
                {selectedUser && (
                    <UserCard
                        avatar={selectedUser.avatar}
                        title={selectedUser.nickname}
                        description={selectedUser.signature}
                        coverImage="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        userInfoItem={userInfoItem}
                        groupCount={5}
                    />
                )}
            </Modal>
        </div>
    )
}

export default AddContact
