import { RequestType } from '@/lib/enum'
import { Button } from '@/ui/button'
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
            <div className="md:max-w-2xl md:mx-auto">
                <RequestHeader />
                {renderContent}
            </div>
        </div>
    )
}

const RequestContactList = () => {
    return (
        <div>
            <ItemCard />
        </div>
    )
}

const RequestGroupList = () => {
    return (
        <div>
            <ItemCard />
        </div>
    )
}

const RequestHeader = () => {
    return (
        <div className="flex justify-between items-center mb-10">
            <h2 className="text-lg">好友通知</h2>
            <div className="flex items-center space-x-2">
                <Button>全部已读</Button>
                <Button variant="destructive">清空</Button>
            </div>
        </div>
    )
}

const ItemCard: React.FC = () => {
    return (
        <div className="rounded-lg border-b border-muted-foreground/20 flex flex-col pb-2">
            <div className="flex items-center">
                <img src="https://via.placeholder.com/40x40" alt="User Avatar" className="rounded-full mr-3" />
                <div className="flex justify-between flex-1 items-center">
                    <div className="flex flex-col">
                        <p>
                            <span>快递王哥</span>
                            <span>2024/05/12</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">留言：你是傻逼</p>
                    </div>
                    <span className="text-sm">已同意</span>
                </div>
            </div>
        </div>
    )
}

export default RequestList
