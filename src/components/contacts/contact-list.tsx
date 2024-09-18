import { Contact } from '@/interface/model/contact'
import { generateFriendList } from '@/mock/data'
import { ScrollArea } from '@/ui/scroll-area'
import { useMemo } from 'react'
import ListItem from '@/components/common/list-item'
import { arrayToGroups } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { useConfigStore } from '@/stores/config'

const ContactList = () => {
    const friends = useMemo<{ [key: string]: Contact[] }>(() => arrayToGroups(generateFriendList(15)), [])
    const sidebarWidth = useConfigStore((state) => state.sidebarWidth)

    return (
        <ScrollArea className="flex-1">
            <div style={{ width: sidebarWidth }}>
                <ContactHeader />
                {Object.entries(friends).map(([key, value]) => (
                    <div key={key}>
                        <h2 className="px-4 my-2 text-muted-foreground">{key.toUpperCase()}</h2>
                        {value.map((friend, index) => (
                            <ListItem
                                key={index}
                                src="https://picsum.photos/56"
                                name={friend?.nickname}
                                description="[在线]"
                            />
                        ))}
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}

const ContactHeader = () => {
    const routers = useMemo(
        () => [
            {
                path: '/request',
                name: '群/好友申请通知'
            },
            {
                path: '/group',
                name: '群聊'
            },
            {
                path: '/blacklist',
                name: '黑名单'
            }
        ],
        []
    )

    return (
        <div className="flex bg-background flex-col py-2">
            {routers.map((router) => (
                <div
                    key={router.path}
                    className="px-4 py-2.5 cursor-pointer md:hover:bg-muted-foreground/10 flex justify-between items-center"
                >
                    <span>{router.name}</span>
                    <ChevronRight size={16} />
                </div>
            ))}
        </div>
    )
}

export default ContactList
