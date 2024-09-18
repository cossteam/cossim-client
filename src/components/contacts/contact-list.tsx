import { Contact } from '@/interface/model/contact'
import { generateFriendList } from '@/mock/data'
import { ScrollArea } from '@/ui/scroll-area'
import { useCallback, useMemo } from 'react'
import ListItem from '@/components/common/list-item'
import { arrayToGroups, cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { useConfigStore } from '@/stores/config'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RequestType, Tabs } from '@/lib/enum'
import { Button } from '@/ui/button'

const ContactList = () => {
    const sidebarWidth = useConfigStore((state) => state.sidebarWidth)
    const tabActiveKey = useConfigStore((state) => state.tabActiveKey)

    const renderContent = useMemo(() => {
        const defaultContent = (
            <>
                <ContactHeader />
                <Contacts />
            </>
        )
        switch (tabActiveKey) {
            case Tabs.Contact:
                return defaultContent
            case Tabs.Group:
                return <ContactGroups />
            case Tabs.BlackList:
                return <ContactBlackList />
            default:
                return defaultContent
        }
    }, [tabActiveKey])

    return (
        <ScrollArea className="flex-1">
            <div style={{ width: sidebarWidth }}>
                <ContactTabs />
                {renderContent}
            </div>
        </ScrollArea>
    )
}

const ContactTabs = () => {
    const { t } = useTranslation()
    const tabActiveKey = useConfigStore((state) => state.tabActiveKey)
    const updateTabActiveKey = useConfigStore((state) => state.update)

    const tabs = useMemo(
        () => [
            { key: Tabs.Contact, name: t('好友') },
            { key: Tabs.Group, name: t('群组') },
            {
                key: Tabs.BlackList,
                name: t('黑名单')
            }
        ],
        []
    )

    return (
        <div className="py-2 bg-background sticky top-0 z-50">
            <div className="flex px-4 space-x-8">
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        className={cn('flex justify-center cursor-pointer pb-1 relative', {
                            'text-primary': tab.key === tabActiveKey
                        })}
                        onClick={() => updateTabActiveKey({ tabActiveKey: tab.key })}
                    >
                        {tab.name}

                        {tab.key === tabActiveKey && (
                            <span className="inline-block absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-[2px] w-10 bg-primary"></span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

const ContactHeader = () => {
    const { t } = useTranslation()

    const routers = useMemo(
        () => [
            {
                path: `request?type=${RequestType.RequestContact}`,
                name: t('好友申请通知')
            },
            {
                path: `request?type=${RequestType.RequestGroup}`,
                name: t('群聊申请通知')
            }
        ],
        [t]
    )

    return (
        <div className="flex bg-background flex-col py-2">
            {routers.map((router, index) => (
                <Link
                    key={index}
                    to={router.path}
                    className="px-4 py-2.5 cursor-pointer md:hover:bg-muted-foreground/10 flex justify-between items-center"
                >
                    <span>{router.name}</span>
                    <ChevronRight size={16} />
                </Link>
            ))}
        </div>
    )
}

const Contacts = () => {
    const friends = useMemo<{ [key: string]: Contact[] }>(() => arrayToGroups(generateFriendList(15)), [])

    return Object.entries(friends).map(([key, value]) => (
        <div key={key}>
            <h2 className="px-4 my-2 text-muted-foreground">{key.toUpperCase()}</h2>
            {value.map((friend, index) => (
                <Link key={index} to={`profile/${friend?.user_id}`}>
                    <ListItem src="https://picsum.photos/56" name={friend?.nickname} description="[在线]" />
                </Link>
            ))}
        </div>
    ))
}

const ContactGroups = () => {
    return Array.from({ length: 26 }).map((_, index) => (
        <div key={index}>
            <Link key={index} to={`profile/${index}`}>
                <ListItem src="https://picsum.photos/56" name="群聊名称" description="群介绍" />
            </Link>
        </div>
    ))
}

const ContactBlackList = () => {
    const { t } = useTranslation()

    const renderButton = useCallback(() => {
        return <Button size="sm">{t('移出黑名单')}</Button>
    }, [])

    return Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
            <Link key={index} to={`profile/${index}`}>
                <ListItem
                    src="https://picsum.photos/56"
                    name="人名"
                    description="操作时间"
                    reightContent={renderButton()}
                />
            </Link>
        </div>
    ))
}

export default ContactList
