import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'
import { ScrollArea } from '@/ui/scroll-area'
import { Switch } from '@/ui/switch'
import { AudioLines, MessageSquare, Video, MessageSquareOff, Trash2 } from 'lucide-react'
import React, { useCallback } from 'react'

const BUTTON_CLASSES = 'group rounded-2xl gap-x-2'
const BUTTON_ICON_CLASSES = `text-secondary-foreground/80 group-hover:text-primary-foreground`
const BUTTON_PRIMARY_CLASSES = 'hover:bg-primary/80 hover:text-primary-foreground'
const BUTTON_DANGER_CLASSES = 'bg-destructive/80 text-primary-foreground hover:bg-destructive md:w-fit w-full'
const FLEX_BETWEEN_CLASSES = 'flex justify-between py-1'
const TEXT_MUTED_CLASSES = 'text-muted-foreground/80'

const ContactProfile = () => {
    return (
        <ScrollArea className="mx-auto p-6 h-full">
            <ContactHeader />
            <ContactActions />
            <ContactInfo title="基本信息" info={personalInfo} />
            <ContactInfo title="设置" info={socialInfo} />
            <ContactButtons />
        </ScrollArea>
    )
}

const ContactHeader = () => {
    return (
        <div className="flex items-center mb-6">
            <img className="size-24 rounded-full" src="https://picsum.photos/100" alt="User Avatar" />
            <div className="ml-4">
                <h1 className="text-2xl mb-1">Pearl Villarreal</h1>
                <p className={TEXT_MUTED_CLASSES}>Co-Workers</p>
            </div>
        </div>
    )
}

const ContactActions = () => {
    return (
        <div className="flex space-x-4 mb-6">
            <Button className={cn(BUTTON_CLASSES, BUTTON_PRIMARY_CLASSES)} variant="secondary">
                <MessageSquare className={BUTTON_ICON_CLASSES} size={16} />
                发消息
            </Button>
            <Button className={cn(BUTTON_CLASSES, BUTTON_PRIMARY_CLASSES)} variant="secondary">
                <AudioLines className={BUTTON_ICON_CLASSES} size={16} />
                语音通话
            </Button>
            <Button className={cn(BUTTON_CLASSES, BUTTON_PRIMARY_CLASSES)} variant="secondary">
                <Video className={BUTTON_ICON_CLASSES} size={16} />
                视频通话
            </Button>
        </div>
    )
}

enum SettingType {
    Switch = 'Switch',
    Button = 'Button'
}

interface Info {
    label: string
    value: string | boolean
    type?: SettingType
    options?: Array<Pick<Info, 'label' | 'value'>>
}

const ContactInfo: React.FC<{ title: string; info: Array<Info> }> = ({ title, info }) => {
    const renderRight = useCallback((item: Info) => {
        switch (item.type) {
            case SettingType.Switch:
                return <Switch checked={item.value as boolean} onChange={() => {}} />
            // case SettingType.Button:
            //     return (
            //         <div className='flex'>
            //             {item.value}
            //         </div>
            //     )
            default:
                return <span>{item.value}</span>
        }
    }, [])

    return (
        <div className="mb-6">
            <h2 className="text-lg mb-2">{title}</h2>
            <div className="space-y-2">
                {info.map((item, index) => (
                    <div key={index} className={FLEX_BETWEEN_CLASSES}>
                        <span className={TEXT_MUTED_CLASSES}>{item.label}</span>
                        {renderRight(item)}
                    </div>
                ))}
            </div>
        </div>
    )
}

const ContactButtons = () => {
    return (
        <div className="flex md:space-x-2 mt-14 md:justify-end justify-center md:flex-row flex-col gap-y-2">
            <Button className={cn(BUTTON_CLASSES, BUTTON_DANGER_CLASSES)} variant="secondary">
                <MessageSquareOff className="text-primary-foreground" size={16} />
                删除聊天记录
            </Button>
            <Button className={cn(BUTTON_CLASSES, BUTTON_DANGER_CLASSES)} variant="secondary">
                <Trash2 className="text-primary-foreground" size={16} />
                删除好友
            </Button>
        </div>
    )
}

const personalInfo = [
    { label: '昵称', value: 'Eva' },
    { label: '性别', value: 'Female' },
    { label: '出生日期', value: '20/12/2016' },
    { label: '电话号码', value: '+01 369 2015' },
    { label: '邮箱', value: 'earnest.clements@email.com' }
]

const socialInfo = [
    { label: '消息免打扰', value: false, type: SettingType.Switch },
    { label: '黑名单', value: false, type: SettingType.Switch }
]

export default ContactProfile
