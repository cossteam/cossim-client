import { RequestType } from '@/lib/enum'
import React, { useMemo } from 'react'

const RequestList: React.FC<{ type: RequestType }> = ({ type }) => {
    const renderContent = useMemo(() => {
        switch (type) {
            case RequestType.RequestContact:
                return <RequestContactList />
            case RequestType.RequestGroup:
                return <RequestGroupList />
            default:
                return <RequestContactList />
        }
    }, [type])

    return (
        <div className="p-6">
            <RequestHeader />
            {renderContent}
        </div>
    )
}

export const RequestContactList = () => {
    return <div>RequestContactList</div>
}

export const RequestGroupList = () => {
    return <div>RequestGroupList</div>
}

const RequestHeader = () => {
    return (
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Requests</h2>
            <div className="flex items-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    New Request
                </button>
            </div>
        </div>
    )
}

const CARD_CLASSES = 'p-4 rounded-lg border-b border-muted-foreground/20 flex flex-col'
const AVATAR_CLASSES = 'rounded-full mr-3'
const TIME_CLASSES = 'text-sm text-muted-foreground'
const STATUS_CLASSES = 'text-sm'

// UserCard component to represent each user card
const UserCard: React.FC<{
    avatar: string
    name: string
    time: string
    message: string
    status: string
    statusColor: string
}> = ({ avatar, name, time, message, status, statusColor }) => {
    return (
        <div className={CARD_CLASSES}>
            <div className="flex items-center">
                <img src={avatar} alt="User Avatar" className={AVATAR_CLASSES} />
                <div className="flex justify-between flex-1 items-center">
                    <div className="flex flex-col">
                        <p>
                            <span>{name}</span>
                            <span>{time}</span>
                        </p>
                        <p className={`${TIME_CLASSES} mt-2`}>{message}</p>
                    </div>
                    <span className={`${statusColor} ${STATUS_CLASSES}`}>{status}</span>
                </div>
            </div>
        </div>
    )
}

// Main component to render the list of user cards
const UserList: React.FC<{ type: RequestType }> = () => {
    const users = [
        {
            avatar: 'https://placehold.co/40x40',
            name: 'A海哥',
            time: '请求加为好友 2024/05/12',
            message: '留言：我是海哥',
            status: '已同意',
            statusColor: 'text-green-500'
        },
        {
            avatar: 'https://placehold.co/40x40',
            name: '大(家)越',
            time: '正在验证你的邀请 2017/12/17',
            message: '留言：我是A哥',
            status: '等待验证',
            statusColor: 'text-yellow-500'
        },
        {
            avatar: 'https://placehold.co/40x40',
            name: '讯·淘宝客服1',
            time: '正在验证你的邀请 2016/10/01',
            message: '留言：我是A电哥',
            status: '等待验证',
            statusColor: 'text-yellow-500'
        }
    ]

    return (
        <div className="space-y-4 md:max-w-2xl md:mx-auto">
            {users.map((user, index) => (
                <UserCard key={index} {...user} />
            ))}
        </div>
    )
}

export default UserList
