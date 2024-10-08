import { useCallback, useMemo } from 'react'
import { Message } from '@/interface/model/dialog'
import { cn } from '@/lib/utils'

interface ChatContentProps {
    aligin?: 'left' | 'right'
    item: Message
}

function ChatContent({ aligin = 'left', item }: ChatContentProps) {
    const baseLayout = useMemo(
        () => ({
            'justify-start': aligin === 'left',
            'justify-end': aligin === 'right'
        }),
        [aligin]
    )

    const renderContent = useCallback(() => {
        return (
            <div
                className={cn('mt-2 w-auto max-w-full p-4 rounded-b-xl', {
                    'rounded-tr-xl bg-muted-foreground/10': aligin === 'left',
                    'rounded-tl-xl bg-primary/10': aligin === 'right'
                })}
            >
                <p className="text-sm break-before-auto break-all">{item.content}</p>
            </div>
        )
    }, [])

    return (
        <div className={cn('w-full flex py-3 px-5', baseLayout)}>
            <div
                className={cn('w-4/5 flex flex-col', {
                    'items-start': aligin === 'left',
                    'items-end': aligin === 'right'
                })}
            >
                <div className="flex items-center gap-x-2">
                    <img
                        className={cn('size-5 overflow-hidden rounded-full', {
                            'order-first': aligin === 'left',
                            'order-last': aligin === 'right'
                        })}
                        src="https://picsum.photos/48"
                        alt=""
                    />
                    <span className="text-xs text-foreground/80">{item?.sender_info?.name}</span>
                </div>

                {renderContent()}

                <div className={cn('flex mt-1 px-1', baseLayout)}>
                    <span className="text-slate-400 text-xs">12:30</span>
                </div>
            </div>
        </div>
    )
}

export default ChatContent
